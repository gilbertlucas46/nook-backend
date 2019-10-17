import { ServerRoute } from 'hapi';
import * as Joi from 'joi';
import * as UniversalFunctions from '@src/utils';
import * as Constant from '@src/constants/app.constant';
import { AdminProfileService, AdminService, UserService } from '../../controllers';
import * as config from 'config';
import * as utils from '@src/utils';
import { UserRequest } from '@src/interfaces/user.interface';
import { AdminRequest } from '@src/interfaces/admin.interface';
import { PropertyRequest } from '@src/interfaces/property.interface';

export let adminProfileRoute: ServerRoute[] = [
	/**
	 * @description:Login via mail
	 */
	{
		method: 'POST',
		path: '/v1/admin/login',
		handler: async (request, h) => {
			try {
				const payload: any = request.payload;
				const registerResponse = await AdminProfileService.login(payload);
				return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.LOGIN, registerResponse));
			} catch (error) {
				return (UniversalFunctions.sendError(error));
			}
		},
		options: {
			description: 'login to application',
			tags: ['api', 'anonymous', 'Admin', 'login'],
			// auth: 'BasicAuth'
			validate: {
				payload: {
					email: Joi.string().email({ minDomainAtoms: 2 }),
					password: Joi.string().min(6).max(16).trim().required(),
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
	 *
	 * @description: forget passsword to send the link over mail
	 */
	{
		method: 'PATCH',
		path: '/v1/admin/forgetPassword',
		handler: async (request, h) => {
			try {
				const payload: UserRequest.ForgetPassword = request.payload as any;
				await AdminProfileService.forgetPassword(payload);
				return utils.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.FORGET_PASSWORD_EMAIL, {});
			} catch (error) {
				return UniversalFunctions.sendError(error);
			}
		},
		options: {
			description: 'forget-password to admin',
			tags: ['api', 'anonymous', 'admin', 'forget-password', 'link'],
			// auth: 'AdminAuth',
			validate: {
				payload: {
					email: Joi.string().email({ minDomainAtoms: 2 }),
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
	 * @description : update the admin Profile
	 */
	{
		method: 'PATCH',
		path: '/v1/admin/profile',
		handler: async (request, h) => {
			try {
				const adminData = request.auth && request.auth.credentials && (request.auth.credentials as any).adminData;
				const payload: UserRequest.ProfileUpdate = request.payload as any;
				const responseData = await AdminProfileService.editProfile(payload, adminData);
				return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.UPDATED, responseData));
			} catch (error) {
				return (UniversalFunctions.sendError(error));
			}
		},
		options: {
			description: 'update admin Profile',
			tags: ['api', 'anonymous', 'admin', 'update'],
			auth: 'AdminAuth',
			validate: {
				payload: {
					// _id: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
					name: Joi.string().min(1).max(20).trim(),
					// lastName: Joi.string().min(1).max(20).trim(),
					// phoneNumber: Joi.string().min(7).max(15).trim(),
					profilePicUrl: Joi.string().allow(''),
					// email: Joi.string().email({ minDomainAtoms: 2 }),
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
	 * @description :Admin profile detail via token
	 */
	{
		method: 'GET',
		path: '/v1/admin/profile',
		handler: async (request, h) => {
			try {
				const adminData = request.auth && request.auth.credentials && (request.auth.credentials as any).adminData;
				return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.DEFAULT, adminData));
			} catch (error) {
				return (UniversalFunctions.sendError(error));
			}
		},
		options: {
			description: 'Get Admin Profile',
			tags: ['api', 'anonymous', 'admin', 'Detail'],
			auth: 'AdminAuth',
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
		path: '/v1/admin/verifyLink/{link}',
		handler: async (request, h) => {
			try {

				const payload = request.params;
				const data = await AdminProfileService.verifyLink(payload);
				return h.redirect(config.get('adminBaseUrl') + payload.link);
				// return h.redirect(('localhost:7361') + payload.link);
			} catch (error) {
				if (error.JsonWebTokenError) {
					return h.redirect(config.get('adminInvalidUrl') + 'invalid url');
				} else if (error === 'LinkExpired') {
					return h.redirect(config.get('adminInvalidUrl') + 'LinkExpired');
				} else if (error === 'error') {
					return h.redirect(config.get('adminInvalidUrl') + 'error');
				} else {
					return h.redirect(config.get('adminInvalidUrl') + 'Something went wrong');
				}
			}
		},
		options: {
			description: 'Get Admin verifylink',
			tags: ['api', 'anonymous', 'Admin', 'verifylink'],
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
	 * @description: Admin change passsword
	 */
	{
		method: 'PATCH',
		path: '/v1/admin/change-password',
		handler: async (request, h) => {
			try {
				const adminData = request.auth && request.auth.credentials && (request.auth.credentials as any).adminData;
				const payload: AdminRequest.ChangePassword = request.payload as any;
				const responseData = await AdminProfileService.changePassword(payload, adminData);
				return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.DEFAULT, responseData));
			} catch (error) {
				return (UniversalFunctions.sendError(error));
			}
		},
		options: {
			description: 'Get admin Profile',
			tags: ['api', 'anonymous', 'admin', 'Detail'],
			auth: 'AdminAuth',
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
	 * @description : reset-password send the verify token and the password in the query
	 */
	{
		method: 'PATCH',
		path: '/v1/admin/reset-password',
		handler: async (request, h) => {
			try {
				const payload = request.payload;
				const responseData = await AdminProfileService.verifyLinkForResetPwd(payload);
				return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.DEFAULT, responseData));
			} catch (error) {
				return (UniversalFunctions.sendError(error));
			}
		},
		options: {
			description: 'Get Admin Profile',
			tags: ['api', 'anonymous', 'admin', 'reset'],
			validate: {
				payload: {
					token: Joi.string(),
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
	/**
	 *
	 * @param payload property and filtering
	 */
	{
		method: 'GET',
		path: '/v1/admin/property',
		handler: async (request, h) => {
			try {
				const adminData = request.auth && request.auth.credentials && (request.auth.credentials as any).adminData;
				const payload: PropertyRequest.SearchProperty = request.query as any;
				utils.consolelog('This request is on', `${request.path}with parameters ${JSON.stringify(payload)}`, true);
				const responseData = await AdminService.getProperty(payload);
				return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.DEFAULT, responseData));
			} catch (error) {
				return (UniversalFunctions.sendError(error));
			}
		},
		options: {
			description: 'Get admin properties',
			tags: ['api', 'anonymous', 'admin', 'Detail'],
			auth: 'AdminAuth',
			validate: {
				query: {
					page: Joi.number(),
					limit: Joi.number(),
					sortBy: Joi.string(),
					sortType: Joi.number().valid(Constant.ENUM.SORT_TYPE),
					searchTerm: Joi.string(),
					fromDate: Joi.number(),
					toDate: Joi.number(),
					property_status: Joi.number().valid([
						Constant.DATABASE.PROPERTY_STATUS.PENDING.NUMBER,
						Constant.DATABASE.PROPERTY_STATUS.ACTIVE.NUMBER,
						Constant.DATABASE.PROPERTY_STATUS.DECLINED.NUMBER,
						Constant.DATABASE.PROPERTY_STATUS.SOLD_RENTED.NUMBER,
						Constant.DATABASE.PROPERTY_STATUS.EXPIRED.NUMBER,
					]),
					property_type: Joi.string().trim().valid([
						Constant.DATABASE.PROPERTY_TYPE['APPARTMENT/CONDO'],
						Constant.DATABASE.PROPERTY_TYPE.COMMERCIAL,
						Constant.DATABASE.PROPERTY_TYPE.HOUSE_LOT,
						Constant.DATABASE.PROPERTY_TYPE.LAND,
						Constant.DATABASE.PROPERTY_TYPE.ROOM,
					]),
					// type: Joi.string(),
					label: Joi.array(),
					minPrice: Joi.number(),
					maxPrice: Joi.number(),
					propertyType: Joi.number(),
					byCity: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
					byRegion: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
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
	 * @Description: property detail by id
	 */
	{
		method: 'GET',
		path: '/v1/admin/property/{propertyId}',
		handler: async (request, h) => {
			try {
				// let adminData = request.auth && request.auth.credentials && request.auth.credentials.adminData;
				const payload: AdminRequest.PropertyDetail = request.params as any;
				utils.consolelog('This request is on', `${request.path}with parameters ${JSON.stringify(payload)}`, true);
				const responseData = await AdminService.getPropertyById(payload);
				return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.DEFAULT, responseData));
			} catch (error) {
				return (UniversalFunctions.sendError(error));
			}
		},
		options: {
			description: 'admin Property detail',
			tags: ['api', 'anonymous', 'admin', 'Detail'],
			auth: 'AdminAuth',
			validate: {
				params: {
					propertyId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
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
	 * @Description:approve property request accept or decline
	 */
	{
		method: 'PATCH',
		path: '/v1/admin/property/{propertyId}',
		handler: async (request, h) => {
			try {
				const adminData = request.auth && request.auth.credentials && (request.auth.credentials as any).adminData;
				const payload: AdminRequest.UpdatePropertyStatus = {
					status: (request.payload as any).status,
					propertyId: request.params.propertyId,
				};
				utils.consolelog('This request is on', `${request.path}with parameters ${JSON.stringify(payload)}`, true);
				const responseData = await AdminService.updatePropertyStatus(payload, adminData);
				return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.DEFAULT, responseData));
			} catch (error) {
				return (UniversalFunctions.sendError(error));
			}
		},
		options: {
			description: 'admin Property detail',
			tags: ['api', 'anonymous', 'admin', 'Detail'],
			auth: 'AdminAuth',
			validate: {
				params: {
					propertyId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
				},
				payload: {
					status: Joi.number().valid([
						Constant.DATABASE.PROPERTY_STATUS.ACTIVE.NUMBER,
						Constant.DATABASE.PROPERTY_STATUS.DECLINED.NUMBER,
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
	 * @Description:admin logout
	 */
	{
		method: 'PATCH',
		path: '/v1/admin/logout',
		handler: async (request, h) => {
			try {
				const adminData = request.auth && request.auth.credentials && (request.auth.credentials as any).adminData;
				const payload: AdminRequest.Logout = request.payload as AdminRequest.Logout;
				const registerResponse = await AdminProfileService.logout(payload, adminData);
				return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.LOGIN, registerResponse));
			} catch (error) {
				return (UniversalFunctions.sendError(error));
			}
		},
		options: {
			description: 'logout to application',
			tags: ['api', 'anonymous', 'Admin', 'logout'],
			auth: 'AdminAuth',
			validate: {
				payload: {
					deviceId: Joi.string(),
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
	 * @Description:admin dashboard
	 */
	{
		method: 'GET',
		path: '/v1/admin/dashboard',
		handler: async (request, h) => {
			try {
				const adminData = request.auth && request.auth.credentials && (request.auth.credentials as any).adminData;
				const registerResponse = await AdminService.dashboard(adminData);
				return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.DEFAULT, registerResponse));
			} catch (error) {
				return (UniversalFunctions.sendError(error));
			}
		},
		options: {
			description: 'admin dashbiard',
			tags: ['api', 'anonymous', 'Admin', 'dashboard'],
			auth: 'AdminAuth',
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

];
