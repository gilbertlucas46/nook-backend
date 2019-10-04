import { ServerRoute, Request } from 'hapi';
import * as Joi from 'joi';
import * as UniversalFunctions from '@src/utils';
import * as Constant from '@src/constants/app.constant';
import { UserService } from '@src/controllers';
import * as config from 'config';
import * as utils from '@src/utils';
import { UserRequest } from '@src/interfaces/user.interface';
import { PropertyRequest } from '@src/interfaces/property.interface';
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
				return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S201.CREATED, registerResponse));
			} catch (error) {
				return (UniversalFunctions.sendError(error));
			}
		},
		options: {
			description: 'Register to applications',
			tags: ['api', 'anonymous', 'user', 'register'],
			// auth: 'BasicAuth'
			validate: {
				payload: {
					userName: Joi.string().min(3).max(32).trim().required(),
					email: Joi.string().email(),
					password: Joi.string().min(6).max(16).trim().required(),
					type: Joi.string().valid([
						Constant.DATABASE.USER_TYPE.AGENT.TYPE,
						Constant.DATABASE.USER_TYPE.OWNER.TYPE,
						Constant.DATABASE.USER_TYPE.TENANT.TYPE,
						Constant.DATABASE.USER_TYPE.GUEST.TYPE,
					]),
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
				return (UniversalFunctions.sendError(error));
			}
		},
		options: {
			description: 'login to applications',
			tags: ['api', 'anonymous', 'user', 'register'],
			// auth: 'BasicAuth'
			validate: {
				payload: {
					email: Joi.string().min(4).max(100),
					password: Joi.string().min(6).max(16).trim().required(),
					deviceToken: Joi.string(),
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
	 * @description:get user's property via id
	 */
	{
		method: 'GET',
		path: '/v1/user/property/{_id}',
		async handler(request, h) {
			try {
				const payload: PropertyRequest.PropertyDetail = request.params as any;
				const propertyDetail = await UserService.propertyDetail(payload);
				return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.DEFAULT, propertyDetail));
			} catch (error) {
				return (UniversalFunctions.sendError(error));
			}
		},
		options: {
			description: 'get detail of property ',
			tags: ['api', 'anonymous', 'user', 'register'],
			//  auth: 'UserAuth',
			validate: {
				params: {
					_id: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
				},
				failAction: UniversalFunctions.failActionFunction,
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
				return UniversalFunctions.sendError(error);
			}
		},
		options: {
			description: 'forget-password to user',
			tags: ['api', 'anonymous', 'user', 'forget-password', 'link'],
			// auth: 'UserAuth',
			validate: {
				payload: {
					email: Joi.string().lowercase().trim().required(),
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
	 * @description : update the user Profile
	 */
	{
		method: 'PATCH',
		path: '/v1/user/profile',
		handler: async (request, h) => {
			try {
				// let userData = request.auth && request.auth.credentials && request.auth.credentials.userData;
				const payload: UserRequest.ProfileUpdate = request.payload as any;
				const responseData = await UserService.updateProfile(payload);
				return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.UPDATED, responseData));
			} catch (error) {
				return (UniversalFunctions.sendError(error));
			}
		},
		options: {
			description: 'update user Profile',
			tags: ['api', 'anonymous', 'user', 'update'],
			// auth: 'UserAuth',
			validate: {
				payload: {
					_id: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
					firstName: Joi.string().min(1).max(20).trim(),
					middleName: Joi.string().trim().allow(''),
					lastName: Joi.string().min(1).max(20).trim(),
					phoneNumber: Joi.string().min(7).max(15).trim(),
					type: Joi.string().valid([
						Constant.DATABASE.USER_TYPE.AGENT.TYPE,
						Constant.DATABASE.USER_TYPE.OWNER.TYPE,
						Constant.DATABASE.USER_TYPE.TENANT.TYPE,
					]),
					title: Joi.string().allow(''),
					license: Joi.string().allow(''),
					taxnumber: Joi.string().allow(''),
					faxNumber: Joi.string().allow(''),
					fullPhoneNumber: Joi.string().allow(''),
					language: Joi.string().allow(''),
					companyName: Joi.string().allow(''),
					address: Joi.string().allow(''),
					aboutMe: Joi.string().allow(''),
					profilePicUrl: Joi.string().allow(''),
					backGroundImageUrl: Joi.string().allow(''),
					specializingIn_property_type: Joi.array().items(
						Joi.number().valid([
							Constant.DATABASE.PROPERTY_FOR.RENT.NUMBER,
							Constant.DATABASE.PROPERTY_FOR.SALE.NUMBER,
						]),
					),
					specializingIn_property_category: Joi.array().items(Joi.string().valid([
						Constant.DATABASE.PROPERTY_TYPE['APPARTMENT/CONDO'],
						Constant.DATABASE.PROPERTY_TYPE.COMMERCIAL,
						Constant.DATABASE.PROPERTY_TYPE.HOUSE_LOT,
						Constant.DATABASE.PROPERTY_TYPE.LAND,
						Constant.DATABASE.PROPERTY_TYPE.ROOM,
					]),
					),
					serviceAreas: Joi.array().items(Joi.number()),
				},
				// headers: UniversalFunctions.authorizationHeaderObj,
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
				return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.DEFAULT, userData));
			} catch (error) {
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
					link: Joi.string(),
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
				return (UniversalFunctions.sendError(error));
			}
		},
		options: {
			description: 'Get user Profile',
			tags: ['api', 'anonymous', 'user', 'Detail'],
			auth: 'UserAuth',
			validate: {
				payload: {
					oldPassword: Joi.string().min(6).max(16),
					newPassword: Joi.string().min(6).max(16),
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
					link: Joi.string(),
					password: Joi.string().min(6).max(16),
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
	{
		method: 'GET',
		path: '/v1/user/dashboard',
		handler: async (request, h) => {
			try {
				const userData = request.auth && request.auth.credentials && (request.auth.credentials as any).userData;
				const responseData = await UserService.dashboard(userData);
				return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.DEFAULT, responseData));
			} catch (error) {
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
	/**
	 * @description user all property except the current property
	 */
	{
		method: 'GET',
		path: '/v1/user/suggested-property',
		async handler(request, h) {
			try {
				// const userData = request.auth && request.auth.credentials && request.auth.credentials['userData'];
				const payload: PropertyRequest.UserProperty = request.query as any;
				const propertyDetail = await UserService.userProperty(payload);
				return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.DEFAULT, propertyDetail));
			} catch (error) {
				return (UniversalFunctions.sendError(error));
			}
		},
		options: {
			description: 'get user all property detail of property ',
			tags: ['api', 'anonymous', 'user', 'register'],
			// auth: 'UserAuth',
			validate: {
				query: {
					propertyType: Joi.number().valid([
						Constant.DATABASE.PROPERTY_STATUS.ACTIVE.NUMBER,
						Constant.DATABASE.PROPERTY_STATUS.DRAFT.NUMBER,
						Constant.DATABASE.PROPERTY_STATUS.EXPIRED.NUMBER,
						Constant.DATABASE.PROPERTY_STATUS.PENDING.NUMBER,
						Constant.DATABASE.PROPERTY_STATUS.SOLD_RENTED.NUMBER,
						Constant.DATABASE.PROPERTY_ACTIONS.ISFEATURED.NUMBER,
					]).default(Constant.DATABASE.PROPERTY_STATUS.ACTIVE.NUMBER),
					page: Joi.number(),
					limit: Joi.number(),
					sortType: Joi.number().valid([
						Constant.ENUM.SORT_TYPE,
					]),
					sortBy: Joi.string().valid(['price', 'date', 'isFeatured']).default('price'),
					propertyId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
				},

				// headers: UniversalFunctions.authorizationHeaderObj,
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
	 */
	{
		method: 'PATCH',
		path: '/v1/user/update-account',
		async handler(request, h) {
			try {
				const userData = request.auth && request.auth.credentials && request.auth.credentials['userData'];
				const payload: UserRequest.UpdateAccount = request.payload as any;
				const propertyDetail = await UserService.updateAccount(payload, userData);
				const userResponse = UniversalFunctions.formatUserData(propertyDetail);
				return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.DEFAULT, userResponse));
			} catch (error) {
				return (UniversalFunctions.sendError(error));
			}
		},
		options: {
			description: 'update account type ',
			tags: ['api', 'anonymous', 'user', 'updateAccount'],
			auth: 'UserAuth',
			validate: {
				payload: {
					userType: Joi.string().valid([
						Constant.DATABASE.USER_TYPE.AGENT.TYPE,
						Constant.DATABASE.USER_TYPE.TENANT.TYPE,
						Constant.DATABASE.USER_TYPE.OWNER.TYPE,
					]),
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
];
