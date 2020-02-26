import { ServerRoute, Request } from 'hapi';
import * as Joi from 'joi';
import * as UniversalFunctions from '@src/utils';
import * as Constant from '@src/constants/app.constant';
import { UserService, PropertyService, CityService } from '@src/controllers';
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
					userName: Joi.string().min(3).max(32).trim().required(),
					email: Joi.string().trim().email(),
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
					email: Joi.string().trim().min(4).max(100).lowercase(),
					password: Joi.string().trim().min(6).max(16).required(),
					deviceToken: Joi.string(),
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
	 * @description:get user's property via id
	 */
	{
		method: 'GET',
		path: '/v1/user/property/{_id}',
		async handler(request, h) {
			try {
				const userData = request.auth && request.auth.credentials && (request.auth.credentials as any).userData;
				const payload: PropertyRequest.PropertyDetail = request.params as any;
				const propertyDetail = await UserService.propertyDetail(payload, userData);
				return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.DEFAULT, propertyDetail));
			} catch (error) {
				return (UniversalFunctions.sendError(error));
			}
		},
		options: {
			description: 'get detail of property ',
			tags: ['api', 'anonymous', 'user', 'register'],
			auth: 'DoubleAuth',
			validate: {
				params: {
					_id: Joi.string().trim().required(),
				},
				headers: UniversalFunctions.authorizationHeaderObj,
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
				// let userData = request.auth && request.auth.credentials && request.auth.credentials.userData;
				const payload: UserRequest.ProfileUpdate = request.payload as any;
				console.log('payloadpayloadpayload', payload);

				const responseData = await UserService.updateProfile(payload);
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
					_id: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
					firstName: Joi.string().trim().min(3).max(30),
					middleName: Joi.string().trim().allow(''),
					lastName: Joi.string().trim().min(3).max(30),
					phoneNumber: Joi.string().trim().min(7).max(15),
					type: Joi.string().trim().valid([
						Constant.DATABASE.USER_TYPE.AGENT.TYPE,
						Constant.DATABASE.USER_TYPE.OWNER.TYPE,
						Constant.DATABASE.USER_TYPE.TENANT.TYPE,
					]),
					title: Joi.string().trim().allow(null).allow(''),
					license: Joi.string().allow('').allow(null),
					taxnumber: Joi.string().allow('').allow(null),
					faxNumber: Joi.string().allow('').allow(null),
					fullPhoneNumber: Joi.string().allow('').allow(null),
					language: Joi.string().allow('').allow(null),
					companyName: Joi.string().allow('').allow(null),
					address: Joi.string().allow('').allow(null),
					aboutMe: Joi.string().allow('').allow(null),
					profilePicUrl: Joi.string().allow('').allow(null),
					backGroundImageUrl: Joi.string().allow('').allow(null),
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
					serviceAreas: Joi.array().items(Joi.string()),
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
	/**
	 * @description user all property except the current property
	 */
	{
		method: 'GET',
		path: '/v1/user/suggested-property',
		async handler(request, h) {
			try {
				const payload: PropertyRequest.UserProperty = request.query as any;
				const propertyDetail = await UserService.userProperty(payload);
				return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.DEFAULT, propertyDetail));
			} catch (error) {
				UniversalFunctions.consolelog(error, 'error', true);
				return (UniversalFunctions.sendError(error));
			}
		},
		options: {
			description: 'get user usggested-property ',
			tags: ['api', 'anonymous', 'user', 'register'],
			auth: 'DoubleAuth',
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
					propertyFor: Joi.number().valid([
						Constant.DATABASE.PROPERTY_FOR.RENT.NUMBER,
						Constant.DATABASE.PROPERTY_FOR.SALE.NUMBER,
					]),
					sortBy: Joi.string().valid(['price', 'date', 'isFeatured']),
					propertyId: Joi.string().trim(),
					userId: Joi.string().trim().regex(/^[0-9a-fA-F]{24}$/),
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
	 * @description: update user Account
	 */
	{
		method: 'PATCH',
		path: '/v1/user/update-account',
		async handler(request, h) {
			try {
				const userData = request.auth && request.auth.credentials && request.auth.credentials['userData'];
				const payload = request.payload as UserRequest.UpdateAccount;
				const propertyDetail = await UserService.updateAccount(payload, userData);
				const userResponse = UniversalFunctions.formatUserData(propertyDetail);
				return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.DEFAULT, userResponse));
			} catch (error) {
				UniversalFunctions.consolelog(error, 'error', true);
				return (UniversalFunctions.sendError(error));
			}
		},
		options: {
			description: 'update account type ',
			tags: ['api', 'anonymous', 'user', 'updateAccount'],
			auth: 'UserAuth',
			validate: {
				payload: {
					userType: Joi.string().trim().valid([
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
	/**
	 * @description:Recent Property city based data
	 */
	{
		method: 'GET',
		path: '/v1/user/city-based',
		async handler(request, h) {
			try {
				const userData = request.auth && request.auth.credentials && request.auth.credentials['userData'];
				const payload: UserRequest.RecentProperty = request.query as any;
				const cityBasedData = await PropertyService.getCityBasedData(payload);
				const userResponse = UniversalFunctions.formatUserData(cityBasedData);
				return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.DEFAULT, userResponse));
			} catch (error) {
				UniversalFunctions.consolelog(error, 'error', true);
				return (UniversalFunctions.sendError(error));
			}
		},
		options: {
			description: 'recent-property list',
			tags: ['api', 'anonymous', 'user', 'city vise Property'],
			auth: 'DoubleAuth',
			validate: {
				query: {
					propertyType: Joi.string().trim().valid([
						Constant.DATABASE.PROPERTY_TYPE['APPARTMENT/CONDO'],
						Constant.DATABASE.PROPERTY_TYPE.COMMERCIAL,
						Constant.DATABASE.PROPERTY_TYPE.HOUSE_LOT,
					]),
					propertyFor: Joi.number().valid([
						Constant.DATABASE.PROPERTY_FOR.RENT.NUMBER,
						Constant.DATABASE.PROPERTY_FOR.SALE.NUMBER,
					]),
					All: Joi.boolean(),
					cityId: Joi.string().trim().regex(/^[0-9a-fA-F]{24}$/).required(),
					page: Joi.number(),
					limit: Joi.number(),
					sortType: Joi.number().valid([
						Constant.ENUM.SORT_TYPE,
					]),
					sortBy: Joi.string().valid('price', 'date', 'isFeatured').default('price'),
					// propertyId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
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

	{
		method: 'GET',
		path: '/v1/user/featuredCount',
		async handler(request, h) {
			try {
				// const userData = request.auth && request.auth.credentials && request.auth.credentials['userData'];
				// const payload: UserRequest.RecentProperty = request.query as any;
				// const cityBasedData = await PropertyService.featureDashboard(payload);
				// const userResponse = UniversalFunctions.formatUserData(cityBasedData);
				// return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.DEFAULT, userResponse));
				const userData = request.auth && request.auth.credentials && (request.auth.credentials as any).userData;
				const responseData = await UserService.featureDashboard(userData);
				return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.DEFAULT, responseData));
			} catch (error) {
				UniversalFunctions.consolelog(error, 'error', true);
				return (UniversalFunctions.sendError(error));
			}
		},
		options: {
			description: 'feature subscription count',
			tags: ['api', 'anonymous', 'user', 'feature subscription count'],
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
	{
		method: 'PATCH',
		path: '/v1/user/complete-registration',
		async handler(request, h) {
			try {
				const { token } = request.query;
				const data = await UserService.completeRegistration(token as string, request.payload as object);
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
				query: {
					token: Joi.string().required(),
				},
				payload: {
					firstName: Joi.string().trim().min(3).max(30).required(),
					lastName: Joi.string().trim().min(3).max(30).required(),
					phoneNumber: Joi.string().trim().min(7).max(15).required(),
					type: Joi.string().trim().valid([
						Constant.DATABASE.USER_TYPE.AGENT.TYPE,
						Constant.DATABASE.USER_TYPE.OWNER.TYPE,
						Constant.DATABASE.USER_TYPE.TENANT.TYPE,
					]).required(),
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
