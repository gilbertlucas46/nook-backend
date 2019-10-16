import * as config from 'config';
import * as Constant from '@src/constants/app.constant';
import * as ENTITY from '@src/entity';
import * as utils from '@src/utils/index';
import * as Jwt from 'jsonwebtoken';
const cert: any = config.get('jwtSecret');
import { MailManager } from '@src/lib/mail.manager';
import { AdminRequest } from '@src/interfaces/admin.interface';
/**
 * @author
 * @description this controller contains actions for admin's account related activities
 */

export class AdminProfileController {

	async login(payload: AdminRequest.Login) {
		try {
			let email: string = payload.email;
			if (email) {
				email = email.trim().toLowerCase();
			}
			const checkData = { email };
			const adminData = await ENTITY.AdminE.getOneEntity(checkData, ['type','password','permission', '_id', 'email']);
			// check email
			if (!adminData) {
				return Promise.reject(Constant.STATUS_MSG.ERROR.E400.INVALID_EMAIL);
			}
			if (!(await utils.deCryptData(payload.password, adminData.password))) {
				return Promise.reject(Constant.STATUS_MSG.ERROR.E400.INVALID_PASSWORD);
			}
			const sessionData = { adminId: adminData._id };
			const sessionObj = await ENTITY.AdminSessionE.createSession(sessionData);
			const tokenObj = {
				adminId: adminData._id,
				sessionId: sessionObj._id,
				type: Constant.DATABASE.USER_TYPE.ADMIN.TYPE,
				permission: adminData.permission
			};
			const accessToken = await ENTITY.AdminE.createToken(tokenObj);
			return { formatedData: adminData, accessToken };
		} catch (err) {
			return Promise.reject(err);
		}
	}

	async profile(payload) {
		try {
			const criteria = {
				_id: payload._id,
			};
			const adminData = await ENTITY.AdminE.getData(criteria, ['email', '_id', 'phoneNumber', 'countryCode']);
			return adminData;
		} catch (err) {
			return Promise.reject(err);
		}
	}

	async editProfile(payload: AdminRequest.ProfileUpdate, adminData) {
		try {
			const criteria = {
				_id: adminData._id,
			};
			const updateAdmin = await ENTITY.AdminE.updateOneEntity(criteria, payload);
			return updateAdmin;
		} catch (err) {
			return Promise.reject(err);
		}
	}

	async forgetPassword(payload: AdminRequest.ForgetPassword) {
		try {
			const criteria = {
				email: payload.email.trim().toLowerCase(),
			};
			const adminData = await ENTITY.AdminE.getData(criteria, ['email', '_id']);
			if (!adminData) { return Promise.reject(Constant.STATUS_MSG.ERROR.E400.INVALID_EMAIL); }
			else {
				const passwordResetToken = await ENTITY.AdminE.createPasswordResetToken(adminData);
				const url = config.get('host') + Constant.SERVER.ADMIN_FORGET_PASSWORD_URL + passwordResetToken;
				const html = `<html><head><title> Nook Admin | Forget Password</title></head><body>Please click here : <a href='${url}'>click</a></body></html>`;
				const mail = new MailManager(payload.email, 'forget password', html);
				mail.sendMail();
				return {};
			}
		} catch (error) {
			utils.consolelog('error', error, true);
			return Promise.reject(error);
		}
	}

	async changePassword(payload: AdminRequest.ChangePassword, adminData: AdminRequest.AdminData) {
		try {
			const criteria = {
				_id: adminData._id,
			};
			const password = await ENTITY.AdminE.getOneEntity(criteria, ['password']);
			if (!(await utils.deCryptData(payload.oldPassword, password.password))) {
				return Promise.reject(Constant.STATUS_MSG.ERROR.E400.INVALID_CURRENT_PASSWORD);
			} else {
				const updatePswd = {
					password: await utils.cryptData(payload.newPassword),
				};
				const updatePassword = await ENTITY.AdminE.updateOneEntity(criteria, updatePswd);
				if (!updatePassword) {
					return Promise.reject(Constant.STATUS_MSG.ERROR.E500.IMP_ERROR);
				} else {
					return Constant.STATUS_MSG.SUCCESS.S200.DEFAULT;
				}
			}
		} catch (error) {
			return Promise.reject(error);
		}
	}

	async verifyLinkForResetPwd(payload) {
		try {
			const result = Jwt.verify(payload.token, cert, { algorithms: ['HS256'] });
			if (!result) { return Promise.reject(); }
			const checkAlreadyUsedToken: any = await ENTITY.AdminE.getOneEntity({ email: result }, ['passwordResetTokenExpirationTime', 'passwordResetToken']);
			if (checkAlreadyUsedToken.passwordResetTokenExpirationTime == null && !checkAlreadyUsedToken.passwordResetToken == null) {
				// send the error page that the already change the pssword in case of already changes fromthe browser
				return Promise.reject('Already_Changed');
			}
			const updatePswd = {
				password: await utils.cryptData(payload.password),
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

	async verifyLink(payload) {
		try {
			const result: any = Jwt.verify(payload.link, cert, { algorithms: ['HS256'] });
			const adminData = await ENTITY.AdminE.getOneEntity(result.email, {});
			if (!adminData) {
				return Promise.reject('error'); // error page will be open here
			} else {
				const criteria = { email: result };
				const userExirationTime: any = await ENTITY.AdminE.getOneEntity(criteria, ['passwordResetTokenExpirationTime', 'passwordResetToken']);
				const today: any = new Date();
				const diffMs = (today - userExirationTime.passwordResetTokenExpirationTime);
				const diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes
				if (diffMins > 0) { return Promise.reject('LinkExpired'); }
				return {}; // success
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
