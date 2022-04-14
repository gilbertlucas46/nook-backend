import { ServerRoute, Request } from 'hapi';
import * as Joi from 'joi';
import * as UniversalFunctions from '@src/utils';
import * as Constant from '@src/constants/app.constant';
import { UserService, CityService } from '@src/controllers';
import * as config from 'config';
import * as utils from '@src/utils';
import { UserRequest } from '@src/interfaces/user.interface';
export let userRoute: ServerRoute[] = [

	/**
	 * @description: register user based on unique mail and userName
	 */
	{
		method: 'POST',
		path: '/v1/user/register',
		async handler(request, h) {
			try {
				const payload: UserRequest.Register = request.payload as any;
				const registerResponse = await UserService.register(payload);
				return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.DEFAULT, {}));
			} catch (error) {
				UniversalFunctions.consolelog(error, 'error', true);
				return (UniversalFunctions.sendError(error));
			}
		},
		options: {
			description: 'Register to applications',
			tags: ['api', 'anonymous', 'user', 'register'],
			auth: 'DoubleAuth',
			validate: {
				payload: {
					// userName: Joi.string().min(3).max(32).trim().required().lowercase(),
					email: Joi.string().trim().email().lowercase().required(),
					password: Joi.string().min(6).max(16).trim().required(),
				},
				headers: UniversalFunctions.authorizationHeaderObj,
				failAction: UniversalFunctions.failActionFunction,
			},
			plugins: {
				'hapi-swagger': {
					responseMessages: Constant.swaggerDefaultResponseMessages,
				},
			},
		},
	},
	/**
	 * @description:Login via mail and userName
	 */
	{
		method: 'POST',
		path: '/v1/user/login',
		async handler(request, h) {
			try {
				const payload: UserRequest.Login = request.payload as any;
				const registerResponse = await UserService.login(payload);
				return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.LOGIN, registerResponse));
			} catch (error) {
				UniversalFunctions.consolelog(error, 'error', true);
				return (UniversalFunctions.sendError(error));
			}
		},
		options: {
			description: 'login to applications',
			tags: ['api', 'anonymous', 'user', 'register'],
			auth: 'DoubleAuth',
			validate: {
				payload: {
					email: Joi.string().trim().email().lowercase(),
					password: Joi.string().trim().min(6).max(16).required(),
					deviceToken: Joi.string(),
					deviceId:Joi.string(),
					partnerId: Joi.string(),
					partnerName: Joi.string(),
				},
				headers: UniversalFunctions.authorizationHeaderObj,
				failAction: UniversalFunctions.failActionFunction,
			},
			plugins: {
				'hapi-swagger': {
					responseMessages: Constant.swaggerDefaultResponseMessages,
				},
			},
		},
	},
	/**
	 * @description:check login status
	 */
	 {
		method: 'PATCH',
		path: '/v1/user/login/status',
		async handler(request, h) {
			try {
				// const userData = request.auth && request.auth.credentials && (request.auth.credentials as any).userData;
				const payload: UserRequest.LoginStatus = request.payload as any;
				console.log("payload from loginstatus",payload);
				// console.log("userdata",userData)
				const registerResponse = await UserService.loginStatus(payload);
				return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.LOGIN_STATUS, registerResponse));
			} catch (error) {
				UniversalFunctions.consolelog(error, 'error', true);
				return (UniversalFunctions.sendError(error));
			}
		},
		options: {
			description: 'check login status',
			tags: ['api', 'anonymous', 'user', 'login', 'status'],
			auth: 'UserAuth',
			validate: {
				payload: {
					deviceId:Joi.string(),
					
				},
				headers: UniversalFunctions.authorizationHeaderObj,
				failAction: UniversalFunctions.failActionFunction,
			},
			plugins: {
				'hapi-swagger': {
					responseMessages: Constant.swaggerDefaultResponseMessages,
				},
			},
		},
	},
	/**
	 * @description:Logout user
	 */
	{
		method: 'PATCH',
		path: '/v1/user/logout',
		handler: async (request, h) => {
			try {
				const userData = request.auth && request.auth.credentials && (request.auth.credentials as any).userData;
				const payload: UserRequest.LogOut = request.payload as UserRequest.LogOut;
				const registerResponse = await UserService.logout(payload,userData);
				return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.LOGOUT,{}));
			} catch (error) {
				utils.consolelog('Error', error, true);
				return (UniversalFunctions.sendError(error));
			}
		},
		options: {
			description: 'logout to application',
			tags: ['api', 'anonymous', 'Admin', 'logout'],
			auth: 'UserAuth',
			validate: {
				payload: {
					deviceId: Joi.string().allow(null),
				},
				headers: UniversalFunctions.authorizationHeaderObj,
				failAction: UniversalFunctions.failActionFunction,
			},
			plugins: {
				'hapi-swagger': {
					responseMessages: Constant.swaggerDefaultResponseMessages,
				},
			},
		},
	},
	/**
	 *
	 * @description: forget passsword to send the link over mail
	 */
	{
		method: 'PATCH',
		path: '/v1/user/forgetPassword',
		handler: async (request, h) => {
			try {
				const payload: UserRequest.ForgetPassword = request.payload as any;
				await UserService.forgetPassword(payload);
				// let url = config.get('host1') + ':' + config.get('port') + '/v1/user/verifyLink/' + forgetPasswordResponse
				return utils.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.FORGET_PASSWORD_EMAIL, {});
			} catch (error) {
				UniversalFunctions.consolelog(error, 'error', true);
				return UniversalFunctions.sendError(error);
			}
		},
		options: {
			description: 'forget-password to user',
			tags: ['api', 'anonymous', 'user', 'forget-password', 'link'],
			auth: 'DoubleAuth',
			validate: {
				payload: {
					email: Joi.string().lowercase().trim().required(),
				},
				headers: UniversalFunctions.authorizationHeaderObj,
				failAction: UniversalFunctions.failActionFunction,
			},
			plugins: {
				'hapi-swagger': {
					responseMessages: Constant.swaggerDefaultResponseMessages,
				},
			},
		},
	},
	/**
	 * @description : update the user Profile
	 */
	{
		method: 'PATCH',
		path: '/v1/user/profile',
		handler: async (request, h) => {
			try {
				const userData = request.auth && request.auth.credentials && (request.auth.credentials as any).userData;
				const payload: UserRequest.ProfileUpdate = request.payload as any;

				const responseData = await UserService.updateProfile(payload, userData);
				return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.UPDATED, responseData));
			} catch (error) {
				UniversalFunctions.consolelog(error, 'error', true);
				return (UniversalFunctions.sendError(error));
			}
		},
		options: {
			description: 'update user Profile',
			tags: ['api', 'anonymous', 'user', 'update'],
			auth: 'UserAuth',
			validate: {
				payload: {
					// _id: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
					firstName: Joi.string().trim().min(3).max(30),
					middleName: Joi.string().trim().allow(''),
					lastName: Joi.string().trim().min(3).max(30),
					phoneNumber: Joi.string().trim().min(7).max(15),
					// type: Joi.string().trim().valid([
					// 	// Constant.DATABASE.USER_TYPE.AGENT.TYPE,
					// 	// Constant.DATABASE.USER_TYPE.OWNER.TYPE,
					// 	Constant.DATABASE.USER_TYPE.TENANT.TYPE,
					// ]),
					// fullPhoneNumber: Joi.string().allow('').allow(null),
					language: Joi.string().allow('').allow(null),
					countryCode: Joi.string(),
					// address: Joi.string().allow('').allow(null),
					aboutMe: Joi.string().allow('').allow(null),
					// bankName:Joi.string().allow('').allow(null),
					// accountHolderName:Joi.string().allow('').allow(null),
					// accountNumber:Joi.string().allow('').allow(null),
					profilePicUrl: Joi.string().allow('').allow(null),
					backGroundImageUrl: Joi.string().allow('').allow(null),
				},
				headers: UniversalFunctions.authorizationHeaderObj,
				failAction: UniversalFunctions.failActionFunction,
			},
			plugins: {
				'hapi-swagger': {
					responseMessages: Constant.swaggerDefaultResponseMessages,
				},
			},
		},
	},
	/**
	 * @description : user bank details
	 */
	 {
		method: 'POST',
		path: '/v1/user/bankDetail',
		handler: async (request, h) => {
			try {
				const userData = request.auth && request.auth.credentials && (request.auth.credentials as any).userData;
				const payload: UserRequest.ProfileUpdate = request.payload as any;

				const responseData = await UserService.updateProfile(payload, userData);
				return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.UPDATED, responseData));
			} catch (error) {
				UniversalFunctions.consolelog(error, 'error', true);
				return (UniversalFunctions.sendError(error));
			}
		},
		options: {
			description: 'update user bank details',
			tags: ['api', 'anonymous', 'user', 'update'],
			auth: 'UserAuth',
			validate: {
				payload: {
					bankName:Joi.string().allow(''),
					accountHolderName:Joi.string().allow(''),
					accountNumber:Joi.string().allow(''),
					
				},
				headers: UniversalFunctions.authorizationHeaderObj,
				failAction: UniversalFunctions.failActionFunction,
			},
			plugins: {
				'hapi-swagger': {
					responseMessages: Constant.swaggerDefaultResponseMessages,
				},
			},
		},
	},
	/**
	 * @description :user profile detail via token
	 */
	{
		method: 'GET',
		path: '/v1/user/profile',
		handler: async (request, h) => {
			try {
				const userData = request.auth && request.auth.credentials && (request.auth.credentials as any).userData;
				// const responseData = await UserService.getProfile(userData);
				return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.DEFAULT, userData));
			} catch (error) {
				UniversalFunctions.consolelog(error, 'error', true);
				return (UniversalFunctions.sendError(error));
			}
		},
		options: {
			description: 'Get user Profile',
			tags: ['api', 'anonymous', 'user', 'Detail'],
			auth: 'UserAuth',
			validate: {
				query: {
				},
				headers: UniversalFunctions.authorizationHeaderObj,
				failAction: UniversalFunctions.failActionFunction,
			},
			plugins: {
				'hapi-swagger': {
					responseMessages: Constant.swaggerDefaultResponseMessages,
				},
			},
		},
	},
	/**
	 * @description : user verifLink for the reset-password
	 */
	{
		method: 'GET',
		path: '/v1/user/verifyLink/{link}',
		handler: async (request, h) => {
			try {
				const payload = request.params;
				await UserService.verifyLink(payload);
				// return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.DEFAULT, responseData))
				return h.redirect(config.get('baseUrl') + payload.link);
			} catch (error) {
				if (error.JsonWebTokenError) {
					return h.redirect(config.get('invalidUrl') + 'invalid url');
				} else if (error === 'LinkExpired') {
					return h.redirect(config.get('invalidUrl') + 'LinkExpired');
				} else {
					return h.redirect(config.get('invalidUrl') + 'Something went wrong');
				}
			}
		},
		options: {
			description: 'Get user Profile',
			tags: ['api', 'anonymous', 'user', 'Detail'],
			validate: {
				params: {
					link: Joi.string().trim(),
				},
				failAction: UniversalFunctions.failActionFunction,
			},
			plugins: {
				'hapi-swagger': {
					responseMessages: Constant.swaggerDefaultResponseMessages,
				},
			},
		},
	},
	/**
	 * @description: user change passsword
	 */
	{
		method: 'PATCH',
		path: '/v1/user/change-password',
		handler: async (request, h) => {
			try {
				const userData = request.auth && request.auth.credentials && (request.auth.credentials as any).userData;
				const payload: UserRequest.ChangePassword = request.payload as any;
				const responseData = await UserService.changePassword(payload, userData);
				return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.DEFAULT, responseData));
			} catch (error) {
				UniversalFunctions.consolelog(error, 'error', true);
				return (UniversalFunctions.sendError(error));
			}
		},
		options: {
			description: 'Get user Profile',
			tags: ['api', 'anonymous', 'user', 'Detail'],
			auth: 'UserAuth',
			validate: {
				payload: {
					oldPassword: Joi.string().trim().min(6).max(16),
					newPassword: Joi.string().trim().min(6).max(16),
				},
				headers: UniversalFunctions.authorizationHeaderObj,
				failAction: UniversalFunctions.failActionFunction,
			},
			plugins: {
				'hapi-swagger': {
					responseMessages: Constant.swaggerDefaultResponseMessages,
				},
			},
		},
	},
	/**
	 * @description : reset-password send the verify token adnd the password in the query
	 */
	{
		method: 'PATCH',
		path: '/v1/user/reset-password',
		handler: async (request, h) => {
			try {
				const payload = request.payload;
				const responseData = await UserService.verifyLinkForResetPwd(payload);
				// let responseData = await UserService.resetPassword(payload);
				return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.DEFAULT, responseData));
			} catch (error) {
				if (error.JsonWebTokenError) {
					return h.redirect(config.get('invalidUr') + 'invalid url');
				} else if (error === 'Already_Changed') {
					return h.redirect(config.get('invalidUrl') + 'Already_Changed');
				} else if (error === 'Time_Expired') {
					return h.redirect(config.get('invalidUrl') + 'Oops Time_Expired');
				} else {
					return h.redirect(config.get('invalidUrl') + 'Something went wrong');
				}
			}
		},
		options: {
			description: 'Get user Profile',
			tags: ['api', 'anonymous', 'user', 'reset'],
			validate: {
				payload: {
					link: Joi.string().trim(),
					password: Joi.string().trim().min(6).max(16),
				},
				failAction: UniversalFunctions.failActionFunction,
			},
			plugins: {
				'hapi-swagger': {
					responseMessages: Constant.swaggerDefaultResponseMessages,
				},
			},
		},
	},
	/**
	 * @description : user dashboard count
	 */
	{
		method: 'GET',
		path: '/v1/user/dashboard',
		handler: async (request, h) => {
			try {
				const userData = request.auth && request.auth.credentials && (request.auth.credentials as any).userData;
				const responseData = await UserService.dashboard(userData);
				return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.DEFAULT, responseData));
			} catch (error) {
				UniversalFunctions.consolelog(error, 'error', true);
				return UniversalFunctions.sendError(error);
			}
		},
		options: {
			description: 'Get user dashboard data',
			tags: ['api', 'anonymous', 'user', 'reset'],
			auth: 'UserAuth',
			validate: {
				headers: UniversalFunctions.authorizationHeaderObj,
				failAction: UniversalFunctions.failActionFunction,
			},
			plugins: {
				'hapi-swagger': {
					responseMessages: Constant.swaggerDefaultResponseMessages,
				},
			},
		},
	},
	{
		method: 'PATCH',
		path: '/v1/user/complete-registration',
		async handler(request, h) {
			try {
				// const { token } = request.query;
				// const userData = request.auth && request.auth.credentials && (request.auth.credentials as any).userData;
				const payload = request.payload as UserRequest.CompleteRegister;
				const data = await UserService.completeRegistration(payload);
				return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.DEFAULT, data));
			} catch (error) {
				UniversalFunctions.consolelog(error, 'error', true);
				return (UniversalFunctions.sendError(error));
			}
		},
		options: {
			description: 'Complete registration second step',
			tags: ['api', 'anonymous', 'user', 'complete registration'],
			auth: 'DoubleAuth',
			validate: {
				// query: {
				// 	token: Joi.string().required(),
				// },
				payload: {
					// userName: Joi.string().min(3).max(32).trim().required().lowercase(),
					email: Joi.string().trim().email().lowercase(),
					password: Joi.string().min(6).max(16).trim().required(),
					firstName: Joi.string().trim().min(3).max(30).required(),
					lastName: Joi.string().trim().min(3).max(30).required(),
					phoneNumber: Joi.string().trim().min(7).max(15).required(),
					ipAddress: Joi.string(),
					countryCode: Joi.string().default('+63'),
					partnerName: Joi.string(),
					partnerId: Joi.string(),
					deviceId:Joi.string(),
				},

				headers: UniversalFunctions.authorizationHeaderObj,
				failAction: UniversalFunctions.failActionFunction,
			},
			plugins: {
				'hapi-swagger': {
					responseMessages: Constant.swaggerDefaultResponseMessages,
				},
			},
		},
	}
];
