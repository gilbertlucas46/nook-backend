
import * as config from 'config';
import * as UniversalFunctions from '../../utils';
import * as Constant from '../../constants/app.constant';
import * as ENTITY from '../../entity';
import * as utils from '../../utils/index';
import * as Jwt from 'jsonwebtoken';
const cert: any = config.get('jwtSecret');
import { MailManager } from '../../lib/mail.manager';

export class UserController {

	async register(payload: UserRequest.Register) {
		try {
			const checkMail = {
				email: payload.email.trim().toLowerCase(),
			};
			const checkUserName = {
				userName: payload.userName.trim().toLowerCase(),
			};
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
					};
					const User: UserRequest.Register = await ENTITY.UserE.createOneEntity(userData);
					const userResponse = UniversalFunctions.formatUserData(User);
					return UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S201.CREATED, userResponse);
				}
			}

		} catch (error) {
			return Promise.reject(error);
		}
	}

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
						const formatedData = await utils.formatUserData(userData);
						return { formatedData, accessToken };
					}
				} else {
					const accessToken = await ENTITY.UserE.createToken(payload, userData);
					await ENTITY.SessionE.createSession(payload, userData, accessToken, 'user');
					const formatedData = await utils.formatUserData(userData);
					return { formatedData, accessToken };
				}
			} else {
				return Constant.STATUS_MSG.ERROR.E400.INVALID_LOGIN;
			}
		} catch (error) {
			return Promise.reject(error);
		}
	}
	async portpertyDetail(payload: PropertyRequest.PropertyDetail) {
		try {
			const criteria = {
				_id: payload._id,
			};
			if (payload._id.length < 24 && payload._id.length > 24) {
				return Constant.STATUS_MSG.ERROR.E400.INVALID_ID;
			}
			const getDetail = await ENTITY.PropertyE.getOneEntity(criteria, {});
			if (!getDetail) { return Constant.STATUS_MSG.ERROR.E400.PROPERTY_NOT_REGISTERED; }
			return getDetail;
		} catch (error) {
			return Promise.reject(error);
		}
	}

	async updateProfile(payload: UserRequest.ProfileUpdate ) {
		try {
			const criteria = {
				_id: payload._id,
			};
			if (payload.firstName && payload.lastName && payload.type) {
				payload.isProfileComplete = true;
			} else {
				payload.isProfileComplete = false;
			}

			const updateUser = await ENTITY.UserE.updateOneEntity(criteria, payload);
			return updateUser;

		} catch (error) {
			return Promise.reject(error);
		}
	}

	async forgetPassword(payload: UserRequest.ForgetPassword) {
		try {
			const criteria = {
				email: payload.email.trim().toLowerCase(),
			};
			const userData = await ENTITY.UserE.getData(criteria, ['email', '_id']);
			if (!userData) {
				return Promise.reject(Constant.STATUS_MSG.ERROR.E400.INVALID_EMAIL);
			} else {
				const passwordResetToken = await ENTITY.UserE.createPasswordResetToken(userData);
				const url = config.get('host') + '/v1/user/verifyLink/' + passwordResetToken;
				// let url = 'http://localhost:7361' + '/v1/user/verifyLink/' + passwordResetToken
				const mail = new MailManager(payload.email, 'forGet password', url);
				mail.sendMail();
				return {};
			}
		} catch (error) {
			utils.consolelog('error', error, true);
			return Promise.reject(error);
		}
	}

	async changePassword(payload: UserRequest.ChangePassword, userData: UserRequest.UserData) {
		try {
			const criteria = {
				_id: userData._id,
			};
			const password = await ENTITY.UserE.getOneEntity(criteria, ['password']);
			if (!(await utils.deCryptData(payload.oldPassword, password.password))) { return Promise.reject(Constant.STATUS_MSG.ERROR.E400.INVALID_CURRENT_PASSWORD); } else {
				const updatePswd = {
					password: await utils.cryptData(payload.newPassword),
					updatedAt: new Date().getTime(),
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
			const result: any = await Jwt.verify(payload.link, cert, { algorithms: ['HS256'] });
			const userData = await ENTITY.UserE.getOneEntity(result.email, {});
			if (!userData) { return Constant.STATUS_MSG.ERROR.E500.IMP_ERROR; } else {
				const criteria = { email: result };
				// let userAttribute = ['passwordResetTokenExpirationTime', 'passwordResetToken']
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

	async verifyLinkForResetPwd(payload) {
		try {
			const result = await Jwt.verify(payload.link, cert, { algorithms: ['HS256'] });
			if (!result) { return Promise.reject(); }
			const checkAlreadyUsedToken: any = await ENTITY.UserE.getOneEntity({ email: result }, ['passwordResetTokenExpirationTime', 'passwordResetToken']);
			if (checkAlreadyUsedToken.passwordResetTokenExpirationTime == null && !checkAlreadyUsedToken.passwordResetToken == null) {
				return Promise.reject('Already_Changed');
			} // send the error page that the already change the pssword in case of already changes fromthe browser

			const updatePswd = {
				password: await utils.cryptData(payload.password),
				updatedAt: new Date().getTime(),
				passwordResetTokenExpirationTime: null,
				passwordResetToken: null,
			};
			const today: any = new Date();
			const diffMs = (today - checkAlreadyUsedToken.passwordResetTokenExpirationTime);
			const diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes in negative minus
			if (diffMins > 0) { return Promise.reject('Time_Expired'); } else {
				const updatePassword = await ENTITY.UserE.updateOneEntity({ email: result }, updatePswd);
				if (!updatePassword) { return Promise.reject(Constant.STATUS_MSG.ERROR.E500.IMP_ERROR); } else { return Constant.STATUS_MSG.SUCCESS.S200.DEFAULT; }
			}

		} catch (error) {
			utils.consolelog('error', error, true);
			return Promise.reject(error);
		}
	}

	async dashboard(userData: UserRequest.UserData) {
		try {
			// let query;
			const pipeline = [
				{
					$facet: {
						Active: [
							{
								$match: {
									$and: [{ 'Property_status.number': Constant.DATABASE.PROPERTY_STATUS.ACTIVE.NUMBER }, { userId: userData._id }],
								},
							},
							{ $count: 'Total' },
						],
						Featured: [
							{ $match: { $and: [{ isFeatured: true }, { userId: userData._id }] } },
							{ $count: 'Total' },
						],
						soldPropertyLast30Days: [
							{
								$match: {
									$and: [{ Property_status: Constant.DATABASE.PROPERTY_STATUS.SOLD_RENTED }, { 'property_basic_details.property_for_number': Constant.DATABASE.PROPERTY_FOR.SALE.NUMBER }, { userId: userData._id },
									{ property_sold_time: { $gte: new Date().getTime() - (30 * 24 * 60 * 60 * 1000) } },
									],
								},
							},
							{ $count: 'Total' },
						],
						rentedPropertyLast30Days: [
							{
								$match: {
									$and: [{ Property_status: Constant.DATABASE.PROPERTY_STATUS.SOLD_RENTED }, { 'property_basic_details.property_for_number': Constant.DATABASE.PROPERTY_FOR.RENT.NUMBER }, { userId: userData._id },
									{ property_rent_time: { $gte: new Date().getTime() - (30 * 24 * 60 * 60 * 1000) } },
									],
								},
							},
							{ $count: 'rentPropertyLast30Days' },
						],
					},
				},
				{
					$project: {
						Active: {
							$cond: { if: { $size: '$Active' }, then: { $arrayElemAt: ['$Active.Total', 0] }, else: 0 },
						},

						Featured: {
							$cond: { if: { $size: ['$Featured'] }, then: { $arrayElemAt: ['$Featured.Total', 0] }, else: 0 },
						},
						soldPropertyLast30Days: {
							$cond: { if: { $size: ['$soldPropertyLast30Days'] }, then: { $arrayElemAt: ['$soldPropertyLast30Days.Total', 0] }, else: 0 },
						},
						rentedPropertyLast30Days: {
							$cond: { if: { $size: ['$rentedPropertyLast30Days'] }, then: { $arrayElemAt: ['$rentedPropertyLast30Days.Total', 0] }, else: 0 },
						},
					},
				},

			];
			const data = await ENTITY.UserE.aggregate(pipeline);
			return {
				...data[0],
				isFeaturedProfile: !!userData.isFeaturedProfile,
			};
		} catch (error) {
			return Promise.reject(error);
		}
	}
}

export let UserService = new UserController();
