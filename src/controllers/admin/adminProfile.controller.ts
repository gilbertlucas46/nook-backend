import * as config from 'config';
import * as Constant from '@src/constants/app.constant';
import * as ENTITY from '@src/entity';
import * as utils from '@src/utils/index';
import * as Jwt from 'jsonwebtoken';
const cert: any = config.get('jwtSecret');
import { MailManager } from '@src/lib/mail.manager';
import { AdminRequest } from '@src/interfaces/admin.interface';
const pswdCert: string = config.get('forgetPwdjwtSecret');

/**
 * @author
 * @description this controller contains actions for admin's account related activities
 */

export class AdminProfileController {
	/**
	 * @param payload login
	 * @description login via email or userName
	 */

	async login(payload: AdminRequest.Login) {
		try {
			const email: string = payload.email;
			const checkData = { email: payload.email };
			const adminData = await ENTITY.AdminE.getOneEntity(checkData, ['type', 'password', 'permission', '_id', 'email', 'staffStatus']);
			// check email
			console.log('adminData', adminData);
			if (!adminData) return Promise.reject(Constant.STATUS_MSG.ERROR.E400.INVALID_EMAIL);
			if (adminData.staffStatus === Constant.DATABASE.STATUS.USER.DELETE && adminData === Constant.DATABASE.USER_TYPE.STAFF.TYPE) {
				return Promise.reject(Constant.STATUS_MSG.ERROR.E401.ADMIN_DELETED);
			}
			if (adminData.staffStatus === Constant.DATABASE.STATUS.USER.BLOCKED && adminData === Constant.DATABASE.USER_TYPE.STAFF.TYPE) {
				return Promise.reject(Constant.STATUS_MSG.ERROR.E401.ADMIN_BLOCKED);
			}
			if (!(await utils.decryptWordpressHashNode(payload.password, adminData.password))) {
				return Promise.reject(Constant.STATUS_MSG.ERROR.E400.INVALID_PASSWORD);
			}
			const sessionData = { adminId: adminData._id };
			const sessionObj = await ENTITY.AdminSessionE.createSession(sessionData);
			const tokenObj = {
				adminId: adminData._id,
				sessionId: sessionObj._id,
				type: adminData.type,
				permission: adminData.permission,
			};
			if (adminData.type === Constant.DATABASE.USER_TYPE.STAFF.TYPE) {
				await ENTITY.AdminE.updateOneEntity({ _id: adminData._id }, { $set: { staffLoggedIn: true } }, {});
			}
			const accessToken = await ENTITY.AdminE.createToken(tokenObj);
			return { formatedData: adminData, accessToken };
		} catch (error) {
			utils.consolelog('error', error, true);
			return Promise.reject(error);
		}
	}
	/**
	 *
	 * @param payload  profile detail
	 */

	async profile(payload) {
		try {
			const criteria = { _id: payload._id };
			return await ENTITY.AdminE.getData(criteria, ['email', '_id', 'phoneNumber', 'countryCode', 'permission', 'type', 'firstName', 'lastName']);
		} catch (error) {
			utils.consolelog('error', error, true);
			return Promise.reject(error);
		}
	}

	async editProfile(payload: AdminRequest.ProfileUpdate, adminData) {
		try {
			const criteria = { _id: adminData._id };
			return await ENTITY.AdminE.updateOneEntity(criteria, payload);
		} catch (error) {
			utils.consolelog('error', error, true);
			return Promise.reject(error);
		}
	}
	/**
	 *
	 * @param payload admin forgetpassword link
	 */
	async forgetPassword(payload: AdminRequest.ForgetPassword) {
		try {
			const criteria = { email: payload.email };
			const adminData = await ENTITY.AdminE.getData(criteria, ['email', '_id', 'firstName']);
			if (!adminData) { return Promise.reject(Constant.STATUS_MSG.ERROR.E400.INVALID_EMAIL); }
			if (adminData.staffStatus === Constant.DATABASE.STATUS.USER.DELETE && adminData === Constant.DATABASE.USER_TYPE.STAFF.TYPE) {
				return Promise.reject(Constant.STATUS_MSG.ERROR.E401.ADMIN_DELETED);
			}
			if (adminData.staffStatus === Constant.DATABASE.STATUS.USER.BLOCKED && adminData === Constant.DATABASE.USER_TYPE.STAFF.TYPE) {
				return Promise.reject(Constant.STATUS_MSG.ERROR.E401.ADMIN_BLOCKED);
			}
			else {
				const passwordResetToken = await ENTITY.AdminE.createPasswordResetToken(adminData);
				const url = config.get('host') + Constant.SERVER.ADMIN_FORGET_PASSWORD_URL + passwordResetToken;
				const sendObj = {
					receiverEmail: payload.email,
					subject: 'Admin reset password Nook',
					token: passwordResetToken,
					url,
					userName: adminData.firstName,
				};
				const mail = new MailManager();
				mail.forgetPassword(sendObj);
				return {};
			}
		} catch (error) {
			utils.consolelog('error', error, true);
			return Promise.reject(error);
		}
	}
	/**
	 * @param payload new password
	 * @param adminData via_id
	 */
	async changePassword(payload: AdminRequest.ChangePassword, adminData: AdminRequest.AdminData) {
		try {
			const criteria = { _id: adminData._id };
			const password = await ENTITY.AdminE.getOneEntity(criteria, ['password']);
			if (!(await utils.decryptWordpressHashNode(payload.oldPassword, password.password))) {
				return Promise.reject(Constant.STATUS_MSG.ERROR.E400.INVALID_CURRENT_PASSWORD);
			} else {
				const updatePswd = {
					password: await utils.encryptWordpressHashNode(payload.newPassword),
				};
				const updatePassword = await ENTITY.AdminE.updateOneEntity(criteria, updatePswd);
				if (!updatePassword) return Promise.reject(Constant.STATUS_MSG.ERROR.E500.IMP_ERROR);
				else return Constant.STATUS_MSG.SUCCESS.S200.DEFAULT;
			}
		} catch (error) {
			utils.consolelog('error', error, true);
			return Promise.reject(error);
		}
	}
	/**
	 *
	 * @param payload  new password for reset
	 */
	async verifyLinkForResetPwd(payload) {
		try {
			const result = Jwt.verify(payload.token, pswdCert, { algorithms: ['HS256'] });
			if (!result) { return Promise.reject(); }
			const checkAlreadyUsedToken: any = await ENTITY.AdminE.getOneEntity({ email: result }, ['passwordResetTokenExpirationTime', 'passwordResetToken']);
			if (checkAlreadyUsedToken.passwordResetTokenExpirationTime == null && !checkAlreadyUsedToken.passwordResetToken == null) {
				// send the error page that the already change the pssword in case of already changes fromthe browser
				return Promise.reject('Already_Changed');
			}
			const updatePswd = {
				password: await utils.encryptWordpressHashNode(payload.password),
				passwordResetTokenExpirationTime: null,
				passwordResetToken: null,
			};
			const today: any = new Date();
			const diffMs = (today - checkAlreadyUsedToken.passwordResetTokenExpirationTime);
			const diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes in negative minus
			if (diffMins > 0) { return Promise.reject(Constant.STATUS_MSG.ERROR.E500.IMP_ERROR); }
			else {
				const updatePassword = await ENTITY.AdminE.updateOneEntity({ email: result }, updatePswd);
				if (!updatePassword) {
					return Promise.reject(Constant.STATUS_MSG.ERROR.E500.IMP_ERROR);
				}
				return Constant.STATUS_MSG.SUCCESS.S200.DEFAULT;
			}
		} catch (error) {
			utils.consolelog('error', error, true);
			return Promise.reject(error);
		}
	}
	/**
	 *
	 * @param payload link for verification
	 */
	async verifyLink(payload) {
		try {
			const result: any = Jwt.verify(payload.link, pswdCert, { algorithms: ['HS256'] });
			const findByEmail = {
				email: result,
			};
			const adminData = await ENTITY.AdminE.getOneEntity(findByEmail, {});
			if (!adminData) {
				return Constant.STATUS_MSG.ERROR.E400.INVALID_ID;
			} else {
				const criteria = { email: result };
				const userExirationTime: any = await ENTITY.AdminE.getOneEntity(criteria, ['passwordResetTokenExpirationTime', 'passwordResetToken']);
				const today: any = new Date();
				const diffMs = (today - userExirationTime.passwordResetTokenExpirationTime);
				const diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes
				if (diffMins > 0) { return Promise.reject('LinkExpired'); }
				else { return {}; } // success
			}

		} catch (error) {
			utils.consolelog('error', error, true);
			return Promise.reject(error);
		}
	}

	async logout(payload: AdminRequest.Logout, adminData) {
		try {
			const criteria = {
				adminId: adminData._id,
				deviceId: payload.deviceId,
			};
			const dataToUpdate = {
				isLogin: false,
			};
			const sessionClose = await ENTITY.SessionE.updateOneEntity(criteria, dataToUpdate);
			if (!sessionClose) return Constant.STATUS_MSG.ERROR.E401.INVALID_SESSION_REQUEST;
			return Constant.STATUS_MSG.SUCCESS.S200.LOGOUT;

		} catch (error) {
			utils.consolelog('error', error, true);
			return Promise.reject(error);
		}
	}
}

export let AdminProfileService = new AdminProfileController();
