
import * as config from 'config';
import * as UniversalFunctions from '@src/utils';
import * as Constant from '@src/constants/app.constant';
import * as ENTITY from '@src/entity';
import * as utils from '@src/utils/index';
import * as Jwt from 'jsonwebtoken';
const cert: any = config.get('jwtSecret');
import { MailManager } from '@src/lib/mail.manager';
import { UserRequest } from '@src/interfaces/user.interface';
import { PropertyRequest } from '@src/interfaces/property.interface';
export class UserController {
	/**
	 *
	 * @param payload user detail
	 */
	async register(payload: UserRequest.Register) {
		try {
			const checkMail = { email: payload.email.trim().toLowerCase() };
			const checkUserName = { userName: payload.userName.trim().toLowerCase() };
			const userNameCheck: UserRequest.Register = await ENTITY.UserE.getOneEntity(checkUserName, ['username', '_id']);
			if (userNameCheck && userNameCheck._id) {
				return Constant.STATUS_MSG.ERROR.E400.USER_NAME_ALREDY_TAKEN;
			} else {
				const UserCheck: UserRequest.Register = await ENTITY.UserE.getOneEntity(checkMail, ['email', '_id']);
				if (UserCheck && UserCheck._id) {
					return Constant.STATUS_MSG.ERROR.E400.EMAIL_ALREADY_TAKEN;
				} else {
					const makePassword = await utils.cryptData(payload.password);
					const userData = {
						userName: payload.userName.trim().toLowerCase(),
						email: payload.email.trim().toLowerCase(),
						password: makePassword,
						isEmailVerified: true,
						isProfileComplete: false,
						type: payload.type,
					};
					const User: UserRequest.Register = await ENTITY.UserE.createOneEntity(userData);
					const userResponse = UniversalFunctions.formatUserData(User);
					const html = `<html><head><title> Nook user Register | Thanx for Registering with us...</title></head></html>`;
					const mail = new MailManager(payload.email, 'nook welcomes you', html);
					mail.sendMail();
					return UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S201.CREATED, userResponse);
				}
			}
		} catch (error) {
			return Promise.reject(error);
		}
	}
	/**
	 *
	 * @param payload login via userName and email
	 */
	async login(payload: UserRequest.Login) {
		try {
			let unique = payload.email;
			// check if entered value is email or username
			const checkEmailOrUserName = (unique) => {
				const re = /^(([^<>()\[\]\\.,;:\s@']+(\.[^<>()\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
				return re.test(String(unique).toLowerCase());
			};
			if (checkEmailOrUserName(unique) === true) { unique = unique.trim().toLowerCase(); }
			const checkData = { $or: [{ email: unique }, { userName: payload.email.trim().toLowerCase() }] };
			const userData = await ENTITY.UserE.getOneEntity(checkData, {});
			if (userData && userData._id) {
				if (userData.isEmailVerified) {
					if (!(await utils.deCryptData(payload.password, userData.password))) {
						return Constant.STATUS_MSG.ERROR.E400.INVALID_PASSWORD;
					} else {
						const accessToken = await ENTITY.UserE.createToken(payload, userData);
						await ENTITY.SessionE.createSession(payload, userData, accessToken, 'user');
						const formatedData = utils.formatUserData(userData);
						return { formatedData, accessToken };
					}
				} else {
					const accessToken = await ENTITY.UserE.createToken(payload, userData);
					await ENTITY.SessionE.createSession(payload, userData, accessToken, 'user');
					const formatedData = utils.formatUserData(userData);
					return { formatedData, accessToken };
				}
			} else {
				return Constant.STATUS_MSG.ERROR.E400.INVALID_LOGIN;
			}
		} catch (error) {
			return Promise.reject(error);
		}
	}
	/**
	 *
	 * @param payload property detail by id
	 */
	async propertyDetail(payload: PropertyRequest.PropertyDetail) {
		try {
			const getPropertyData = await ENTITY.PropertyE.getPropertyDetailsById(payload._id);
			if (getPropertyData.property_status.number === Constant.DATABASE.PROPERTY_STATUS.SOLD_RENTED.NUMBER) {
				return Promise.reject(Constant.STATUS_MSG.ERROR.E400.PROPERTY_SOLD);
			}
			if (!getPropertyData) { return Promise.reject(Constant.STATUS_MSG.ERROR.E400.INVALID_ID); }
			return getPropertyData;
		} catch (error) {
			return Promise.reject(error);
		}
	}
	/**
	 *
	 * @param payload userProfile data to update
	 */
	async updateProfile(payload: UserRequest.ProfileUpdate) {
		try {
			const criteria = { _id: payload._id };
			if (payload.firstName && payload.lastName && payload.type) { payload.isProfileComplete = true; }
			else { payload.isProfileComplete = false; }
			const getUser = await ENTITY.UserE.getOneEntity(criteria, {});
			const updateUser = await ENTITY.UserE.updateOneEntity(criteria, payload);

			if (getUser.firstName !== updateUser.firstName || getUser.lastName !== updateUser.lastName ||
				getUser.profilePicUrl !== updateUser.profilePicUrl || getUser.phoneNumber !== updateUser.phoneNumber) {

				const propertyCriteria = { userId: updateUser._id };
				const updatePropertyData = {
					property_added_by: {
						userId: updateUser._id,
						userName: updateUser.userName,
						phoneNumber: updateUser.phoneNumber,
						profilePicUrl: updateUser.profilePicUrl,
						firstName: updateUser.firstName,
						lastName: updateUser.lastName,
					},
					isProfileComplete: true,
				};
				ENTITY.PropertyE.updateMultiple(propertyCriteria, updatePropertyData);
			}
			return updateUser;
		} catch (error) {
			return Promise.reject(error);
		}
	}
	/**
	 *
	 * @param payload forget password via email or userName
	 */
	async forgetPassword(payload: UserRequest.ForgetPassword) {
		try {
			const criteria = { $or: [{ userName: payload.email }, { email: payload.email }] };
			const userData = await ENTITY.UserE.getData(criteria, ['email', '_id']);
			if (!userData) { return Promise.reject(Constant.STATUS_MSG.ERROR.E400.INVALID_EMAIL); }
			else {
				const passwordResetToken = await ENTITY.UserE.createPasswordResetToken(userData);
				const url = config.get('host') + Constant.SERVER.FORGET_PASSWORD_URL + passwordResetToken;
				const html = `<html><head><title> Nook User | Forget Password</title></head><body>Please click here : <a href='${url}'>click</a></body></html>`;
				const mail = new MailManager(userData.email, 'forGet password', html);
				mail.sendMail();
				return {};
			}
		} catch (error) {
			utils.consolelog('error', error, true);
			return Promise.reject(error);
		}
	}
	/**
	 *
	 * @param payload password to be update
	 * @param userData user's _id
	 */
	async changePassword(payload: UserRequest.ChangePassword, userData: UserRequest.UserData) {
		try {
			const criteria = { _id: userData._id };
			const password = await ENTITY.UserE.getOneEntity(criteria, ['password']);
			if (!(await utils.deCryptData(payload.oldPassword, password.password))) { return Promise.reject(Constant.STATUS_MSG.ERROR.E400.INVALID_CURRENT_PASSWORD); } else {
				const updatePswd = {
					password: await utils.cryptData(payload.newPassword),
				};
				const updatePassword = await ENTITY.UserE.updateOneEntity(criteria, updatePswd);
				if (!updatePassword) { return Promise.reject(Constant.STATUS_MSG.ERROR.E500.IMP_ERROR); } else { return Constant.STATUS_MSG.SUCCESS.S200.DEFAULT; }
			}
		} catch (error) {
			return Promise.reject(error);
		}
	}

	async verifyLink(payload) {
		try {
			const result: any = Jwt.verify(payload.link, cert, { algorithms: ['HS256'] });
			const userData = await ENTITY.UserE.getOneEntity(result.email, {});
			if (!userData) { return Constant.STATUS_MSG.ERROR.E400.INVALID_ID; } else {
				const criteria = { email: result };
				const userExirationTime: any = await ENTITY.UserE.getOneEntity(criteria, ['passwordResetTokenExpirationTime', 'passwordResetToken']);
				const today: any = new Date();
				const diffMs = (today - userExirationTime.passwordResetTokenExpirationTime);
				const diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes
				if (diffMins > 0) { return Promise.reject('LinkExpired'); } else { return {}; } // success
			}
		} catch (error) {
			return Promise.reject(error);
		}
	}
	/**
	 *
	 * @param payload verify link of the forget password e-mail
	 */
	async verifyLinkForResetPwd(payload) {
		try {
			const result = Jwt.verify(payload.link, cert, { algorithms: ['HS256'] });
			if (!result) { return Promise.reject(); }
			const checkAlreadyUsedToken: any = await ENTITY.UserE.getOneEntity({ email: result }, ['passwordResetTokenExpirationTime', 'passwordResetToken']);
			if (checkAlreadyUsedToken.passwordResetTokenExpirationTime == null && !checkAlreadyUsedToken.passwordResetToken == null) {
				return Promise.reject('Already_Changed');
			} // send the error page that the already change the pssword in case of already changes fromthe browser
			const updatePswd = {
				password: await utils.cryptData(payload.password),
				passwordResetTokenExpirationTime: null,
				passwordResetToken: null,
			};
			const today: any = new Date();
			const diffMs = (today - checkAlreadyUsedToken.passwordResetTokenExpirationTime);
			const diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes in negative minus
			if (diffMins > 0) { return Promise.reject('Time_Expired'); }
			else {
				const updatePassword = await ENTITY.UserE.updateOneEntity({ email: result }, updatePswd);
				if (!updatePassword) { return Promise.reject(Constant.STATUS_MSG.ERROR.E500.IMP_ERROR); } else { return Constant.STATUS_MSG.SUCCESS.S200.DEFAULT; }
			}
		} catch (error) {
			return Promise.reject(error);
		}
	}
	/**
	 *
	 * @param userData userId
	 */
	async dashboard(userData: UserRequest.UserData) {
		try {
			return await ENTITY.UserE.userDashboad(userData);
		} catch (error) {
			return Promise.reject(error);
		}
	}
	/**
	 *
	 * @param payload user's suggested property except current
	 */
	async userProperty(payload: PropertyRequest.UserProperty) {
		try {
			const data = await ENTITY.PropertyE.suggested_property(payload);
			return data;
		} catch (error) {
			return Promise.reject(error);
		}
	}
	/**
	 *
	 * @param payload type to be update
	 * @param userData
	 */
	async updateAccount(payload: UserRequest.UpdateAccount, userData: UserRequest.UserData) {
		try {
			const criteria = { _id: userData._id };
			const dataToUpdate = { type: payload.userType };
			const data = await ENTITY.UserE.updateOneEntity(criteria, dataToUpdate);
			const accessToken = await ENTITY.UserE.createToken(payload, data);
			// await ENTITY.SessionE.createSession(payload, userData, accessToken, 'user');
			const formatedData = utils.formatUserData(data);
			return { formatedData, accessToken };
		}
		catch (error) {
			return Promise.reject(error);
		}
	}
}

export let UserService = new UserController();
