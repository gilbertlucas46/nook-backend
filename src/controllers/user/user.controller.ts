
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
import * as request from 'request';

export class UserController {
	/**
	 * @function register
	 * @description function to register agent/owner/tenant
	 * @payload payload :Register
	 * return object and send mail
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
	 * @function login
	 * @description function to login agent/owner/tenant
	 * @payload payload :Login
	 * return object with access token
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
			const checkData = { $or: [{ email: unique }, { userName: payload.email }] };
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
	 * @function propertyDetail
	 * @description function to get Detail of the property
	 * @payload payload :PropertyDetail
	 * return Proeperty Data
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
	 * @function updateProfile
	 * @description function to update the user profile
	 * @payload  ProfileUpdate
	 * return object
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
			/**
			 *  push contract to salesforce
			 */
			const salesforceData = {
				userName: updateUser.userName,
				email: updateUser.email,
				firstName: updateUser.firstName,
				middleName: updateUser.middleName,
				lastName: updateUser.lastName,
				phoneNumber: updateUser.phoneNumber,
				type: updateUser.type,
			};

			request.post({ url: config.get('zapier_enquiryUrl'), formData: salesforceData }, function optionalCallback(err, httpResponse, body) {
				if (err) { return console.log(err); }
				console.log('body ----', body);
			});

			return updateUser;
		} catch (error) {
			return Promise.reject(error);
		}
	}
	/**
	 * @function getProfile
	 * @description function to get user profile
	 * @payload  UserData
	 * return object
	 */
	async getProfile(payload: UserRequest.UserData) {
		try {
			if (
				payload.type === Constant.DATABASE.USER_TYPE.AGENT.TYPE ||
				payload.type === Constant.DATABASE.USER_TYPE.OWNER.TYPE
			) {
				const step1 = await ENTITY.SubscriptionE.getSubscrition({ userId: payload._id, featuredType: [Constant.DATABASE.FEATURED_TYPE.PROFILE, Constant.DATABASE.FEATURED_TYPE.HOMEPAGE] });
				if (step1) {
					payload.isFeaturedProfile = true;
					payload.subscriptionexpirarionTime = step1.endDate;
				} else {
					payload.isFeaturedProfile = false;
				}
			} else {
				payload.isFeaturedProfile = false;
			}
			return payload;
		} catch (error) {
			return Promise.reject(error);
		}
	}
	/**
	 * @function forgetPassword
	 * @description function to send the email on the registered emailId
	 * @payload  ForgetPassword
	 * return send mail
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
	 * @function changePassword
	 * @description chanage the password
	 * @payload  ChangePassword and userData
	 * return success
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
				if (!updatePassword) { return Promise.reject(Constant.STATUS_MSG.ERROR.E500.IMP_ERROR); }
				else { return Constant.STATUS_MSG.SUCCESS.S200.DEFAULT; }
			}
		} catch (error) {
			return Promise.reject(error);
		}
	}
	/**
	 * @function verifyLink
	 * @description verify the link of the forgerPassword and verify the expiration time
	 * @payload  jwt link
	 * return and redirect the another api if success
	 */
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
	 * @function verifyLinkForResetPwd
	 * @description verify the link of the user and
	 * @payload  jwt link
	 * return success
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
	 * @function dashboard
	 * @description user dashboard accoordinf to user type
	 * @payload  UserData
	 * return Array
	 */
	async dashboard(userData: UserRequest.UserData) {
		try {
			return await ENTITY.UserE.userDashboad(userData);
		} catch (error) {
			return Promise.reject(error);
		}
	}
	/**
	 * @function userProperty
	 * @description property of the particular user
	 * @payload  UserProperty
	 * return Array
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
	 * @function updateAccount
	 * @description updayte user account to the agent/owner/guest
	 * @payload  UserProperty
	 * return object userdata with access token
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
