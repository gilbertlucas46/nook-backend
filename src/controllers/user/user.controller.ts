

import * as config from 'config';
import * as UniversalFunctions from '@src/utils';
import * as Constant from '@src/constants/app.constant';
import * as ENTITY from '@src/entity';
import * as utils from '@src/utils/index';
import * as Jwt from 'jsonwebtoken';
import { MailManager } from '@src/lib/mail.manager';
import { UserRequest } from '@src/interfaces/user.interface';
import { flattenObject } from '@src/utils';
import fetch from 'node-fetch';
import { ETIME } from 'constants';
import { BaseEntity } from '@src/entity/base/base.entity';
const pswdCert: string = config.get('jwtSecret.app.forgotToken');

export class UserController extends BaseEntity {
	/**
	 * @function register
	 * @description function to register agent/owner/tenant
	 * @payload payload :Register
	 * return object and send mail
	 */
	async register(payload: UserRequest.Register) {
		try {
			const checkMail = { email: payload.email.trim().toLowerCase() };
			// const checkUserName = { userName: payload.userName.trim().toLowerCase() };
			// const userNameCheck: UserRequest.Register = await ENTITY.UserE.getOneEntity(checkUserName, ['username', '_id']);
			// if (userNameCheck && userNameCheck._id) {
				// return Promise.reject(Constant.STATUS_MSG.ERROR.E400.USER_NAME_ALREDY_TAKEN);
				// return Constant.STATUS_MSG.ERROR.E400.USER_NAME_ALREDY_TAKEN;
			// } else {
				const UserCheck: UserRequest.Register = await ENTITY.UserE.getOneEntity(checkMail, ['email', '_id']);
				if (UserCheck && UserCheck._id) {
					return Promise.reject(Constant.STATUS_MSG.ERROR.E400.EMAIL_ALREADY_TAKEN);
				} else {
					return;
				}
			// }
		} catch (error) {
			utils.consolelog('error', error, true);
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
			const unique = payload.email;
			// check if entered value is email or username
			// const checkEmailOrUserName = (unique) => {
			// 	const re = /^(([^<>()\[\]\\.,;:\s@']+(\.[^<>()\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			// 	return re.test(String(unique).toLowerCase());
			// };
			// if (checkEmailOrUserName(unique) === true) { unique = unique.trim().toLowerCase(); }
			const checkData = {email: unique};
			const userData = await ENTITY.UserE.getOneEntity(checkData, {});

			if (userData && userData._id) {
				// if (userData.isEmailVerified) {
				if (userData.status === Constant.DATABASE.STATUS.USER.BLOCKED) {
					return Promise.reject(Constant.STATUS_MSG.ERROR.E401.ADMIN_BLOCKED);
				}
				if (userData.status === Constant.DATABASE.STATUS.USER.DELETE) {
					return Promise.reject(Constant.STATUS_MSG.ERROR.E401.ADMIN_DELETED);
				}
				if (!(await utils.decryptWordpressHashNode(payload.password, userData.password))) {
					return Promise.reject(Constant.STATUS_MSG.ERROR.E400.INVALID_PASSWORD);
				}
				else {
					const accessToken = await ENTITY.UserE.createToken(payload, userData);
					let dataToupdate;
					if (payload.partnerId && payload.partnerName && !userData.hasOwnProperty('partnerId')) {
						dataToupdate = {
							partnerId: payload.partnerId,
							partnerName: payload.partnerName,
						};
						ENTITY.UserE.updateOneEntity({ _id: userData._id }, dataToupdate);
					}
					await ENTITY.SessionE.createSession(payload, userData, accessToken, 'Tenant');
					const formatedData = utils.formatUserData(userData);
					return { formatedData, accessToken };
				}
			} else {
				return Promise.reject(Constant.STATUS_MSG.ERROR.E400.INVALID_LOGIN);
			}
		} catch (error) {
			utils.consolelog('error', error, true);
			return Promise.reject(error);
		}
	}
	/**
	 * @function logout
	 * @description function to logout agent/owner/tenant
	 * @payload payload :Logout
	 * 
	 */
	async logout(payload: UserRequest.LogOut,userData) {
		try {
			const criteria = {
				 userId: userData._id,
				deviceId: payload.deviceId,
			};
			const dataToUpdate = {
				loginStatus: false,
			};
			const sessionClose = await ENTITY.SessionE.removeSession(criteria, dataToUpdate);
			if (!sessionClose) return Promise.reject(Constant.STATUS_MSG.ERROR.E401.INVALID_SESSION_REQUEST);
			return sessionClose;

		} catch (error) {
			utils.consolelog('error', error, true);
			return Promise.reject(error);
		}
	}
	/**
	 * @function loginStatus
	 * @description function to check login  status  agent/owner/tenant
	 * @payload payload :loginStatus
	 * 
	 */
	 async loginStatus(payload: UserRequest.LoginStatus) {
		try {
			const criteria = {
				// userId: userData._id,
				deviceId: payload.deviceId,
			};
			const sessionClose = await ENTITY.SessionE.checkLoginSession(criteria);
			if (!sessionClose) return Promise.reject(Constant.STATUS_MSG.ERROR.E401.INVALID_SESSION_REQUEST);
			return sessionClose;

		} catch (error) {
			utils.consolelog('error', error, true);
			return Promise.reject(error);
		}
	}

	/**
	 * @function updateProfile
	 * @description function to update the user profile
	 * @payload  ProfileUpdate
	 * return object
	 */
	async updateProfile(payload: UserRequest.ProfileUpdate, userData) {
		try {

			const criteria = { _id: userData._id };

			// const isProfileCompleted = await ENTITY.UserE.count({
			// 	_id: payload._id,
			// 	isProfileComplete: true,
			// });

			// if (!isProfileCompleted) {
			// 	payload.isProfileComplete = true;
			// }

			const updateUser = await ENTITY.UserE.updateOneEntity(criteria, payload);
			updateUser['isNewUser'] = 0;
			/**
			 *  push contract to salesforce
			 */
			  if (config.get('environment') === 'production') {
				// if (!isProfileCompleted) {
				// convert document to data	
				const salesforceData = flattenObject(updateUser.toObject ? updateUser.toObject() : updateUser);
				console.log('salesforceDatasalesforceDatasalesforceData', salesforceData);
				const request = {
					method: 'post',
					body: JSON.stringify(salesforceData),
				};
				await fetch(config.get('zapier_personUrl'), request);
				await fetch(config.get('zapier_accountUrl'), request);
				// }
			 }

			return updateUser;
		} catch (error) {
			utils.consolelog('error', error, true);
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
			const userData = await ENTITY.UserE.getData(criteria, ['email', '_id', 'userName', 'firstName']);
			if (!userData) { return Promise.reject(Constant.STATUS_MSG.ERROR.E400.INVALID_EMAIL); }
			else {
				const passwordResetToken = await ENTITY.UserE.createPasswordResetToken(userData);
				const url = config.get('host') + Constant.SERVER.FORGET_PASSWORD_URL + passwordResetToken;

				const sendObj = {
					receiverEmail: userData.email,
					subject: 'reset password Nook',
					token: passwordResetToken,
					url,
					firstName: userData.firstName,
					userName: userData.userName,
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
	 * @function changePassword
	 * @description chanage the password
	 * @payload  ChangePassword and userData
	 * return success
	 */
	async changePassword(payload: UserRequest.ChangePassword, userData: UserRequest.UserData) {
		try {
			const criteria = { _id: userData._id };
			const password = await ENTITY.UserE.getOneEntity(criteria, ['password']);
			if (!(await utils.decryptWordpressHashNode(payload.oldPassword, password.password))) { return Promise.reject(Constant.STATUS_MSG.ERROR.E400.INVALID_CURRENT_PASSWORD); } else {
				const updatePswd = {
					password: await utils.encryptWordpressHashNode(payload.newPassword),
				};
				const updatePassword = await ENTITY.UserE.updateOneEntity(criteria, updatePswd);
				if (!updatePassword) { return Promise.reject(Constant.STATUS_MSG.ERROR.E500.IMP_ERROR); }
				else { return Constant.STATUS_MSG.SUCCESS.S200.DEFAULT; }
			}
		} catch (error) {
			utils.consolelog('error', error, true);
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
			const result: any = Jwt.verify(payload.link, pswdCert, { algorithms: ['HS256'] });
			const userData = await ENTITY.UserE.getOneEntity(result.email, {});
			if (!userData) { return Promise.reject(Constant.STATUS_MSG.ERROR.E400.INVALID_ID); } else {
				const criteria = { email: result };
				const userExirationTime: any = await ENTITY.UserE.getOneEntity(criteria, ['passwordResetTokenExpirationTime', 'passwordResetToken']);
				const today: any = new Date();
				const diffMs = (today - userExirationTime.passwordResetTokenExpirationTime);
				const diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes
				if (diffMins > 0) { return Promise.reject('LinkExpired'); } else { return {}; } // success
			}
		} catch (error) {
			utils.consolelog('error', error, true);
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
			const result = Jwt.verify(payload.link, pswdCert, { algorithms: ['HS256'] });
			if (!result) { return Promise.reject(); }
			const checkAlreadyUsedToken: any = await ENTITY.UserE.getOneEntity({ email: result }, ['passwordResetTokenExpirationTime', 'passwordResetToken']);
			if (checkAlreadyUsedToken.passwordResetTokenExpirationTime == null && !checkAlreadyUsedToken.passwordResetToken == null) {
				return Promise.reject('Already_Changed');
			} // send the error page that the already change the pssword in case of already changes fromthe browser
			const updatePswd = {
				password: await utils.encryptWordpressHashNode(payload.password),
				passwordResetTokenExpirationTime: null,
				passwordResetToken: null,
			};
			const today: any = new Date();
			const diffMs = (today - checkAlreadyUsedToken.passwordResetTokenExpirationTime);
			console.log('diffMinsdiffMins', diffMs);
			const diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes in negative minus
			console.log('diffMinsdiffMinsdiffMins', diffMins);

			if (diffMins > 0) { return Promise.reject('Time_Expired'); }
			else {
				const updatePassword = await ENTITY.UserE.updateOneEntity({ email: result }, updatePswd);
				if (!updatePassword) { return Promise.reject(Constant.STATUS_MSG.ERROR.E500.IMP_ERROR); } else { return Constant.STATUS_MSG.SUCCESS.S200.DEFAULT; }
			}
		} catch (error) {
			utils.consolelog('error', error, true);
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
			const step2 = await ENTITY.UserE.userDashboad(userData);

			// // step2.isFeaturedProfile = step1 ? true : false;
			return step2;
		} catch (error) {
			utils.consolelog('error', error, true);
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
			utils.consolelog('error', error, true);
			return Promise.reject(error);
		}
	}
	async completeRegistration(payload: UserRequest.CompleteRegister) {
		// return await ENTITY.UserE.completeRegisterProcess(token, {
		// 	...payload,
		// 	isProfileComplete: true,
		// });
		try {

			const checkMail = { email: payload.email };
			// const checkUserName = { userName: payload.userName };
			// const userNameCheck: UserRequest.Register = await ENTITY.UserE.getOneEntity(checkUserName, ['username', '_id']);
			// if (userNameCheck && userNameCheck._id) {
			// 	return Promise.reject(Constant.STATUS_MSG.ERROR.E400.USER_NAME_ALREDY_TAKEN);
			// 	// return Constant.STATUS_MSG.ERROR.E400.USER_NAME_ALREDY_TAKEN;
			// } else {
				const UserCheck: UserRequest.Register = await ENTITY.UserE.getOneEntity(checkMail, ['email', '_id']);
				if (UserCheck && UserCheck._id) {
					return Promise.reject(Constant.STATUS_MSG.ERROR.E400.EMAIL_ALREADY_TAKEN);
				} else {
					const makePassword = await utils.encryptWordpressHashNode(payload.password);
					const userData = {
						// userName: payload.userName,
						email: payload.email,
						password: makePassword,
						firstName: payload.firstName,
						lastName: payload.lastName,
						phoneNumber: payload.phoneNumber,
						ipAddress: payload.ipAddress,
						countryCode: payload.countryCode,
						partnerId: payload.partnerId,
						partnerName: payload.partnerName,
						// isEmailVerified: true,
						// isProfileComplete: true,
						// type: payload.type,
					};
					let formatedData = await ENTITY.UserE.createOneEntity(userData);
					const userId=formatedData._id;
					formatedData = JSON.parse(JSON.stringify(formatedData));
					formatedData['isNewUser'] = 1;
					const salesforceData = flattenObject(formatedData.toObject ? formatedData.toObject() : formatedData);
					console.log('salesforceDatasalesforceData', salesforceData);
					const request = {
						method: 'post',
						body: JSON.stringify(salesforceData),
					};

					// SessionE.createSession({}, doc, accessToken, 'user');
					// const formatedData = utils.formatUserData(doc);

					// 	receiverEmail: payload.email,
					// 	subject: 'nook welcomes you',
					// 	userName: payload.userName,
					// };

					if (config.get('environment') === 'production') {
						await fetch(config.get('zapier_personUrl'), request);
						await fetch(config.get('zapier_accountUrl'), request);
					}

					const accessToken = ENTITY.UserE.createRegisterToken(formatedData._id);
					console.log("userId===>>",userId)
					ENTITY.SessionE.createSession(payload,userId, accessToken, 'Tenant');
					// mail.welcomeMail(sendObj);
					return { formatedData, accessToken };
					// return UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S201.CREATED, token);
				}
			// }
		} catch (error) {
			utils.errorReporter(error)
			return Promise.reject(error)
		}

	}


	async seacrhUserByAdmin(payload) {
		try {
			const { searchTerm } = payload;
			let seacrhObject: any = {}

			seacrhObject = {
				status: Constant.DATABASE.STATUS.USER.ACTIVE,
				// $and:{status:}
				$or: [
					{ userName: { $regex: searchTerm, $options: 'i' } },
					{ email: { $regex: searchTerm, $options: 'i' } },
					{ firstName: { $regex: searchTerm, $options: 'i' } },
				],
			};

			const usersList = await this.DAOManager.getData('User', seacrhObject, {}, { limit: 10 })

			return usersList;
		} catch (error) {
			return Promise.reject(error);
		}
	}
	
}
export let UserService = new UserController();
