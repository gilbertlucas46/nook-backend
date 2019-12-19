import { ServerRoute } from 'hapi';
import * as Joi from 'joi';
import * as UniversalFunctions from '@src/utils';
import * as Constant from '@src/constants/app.constant';
import { AdminProfileService, AdminService, UserService, LoanController } from '../../controllers';
import * as config from 'config';
import * as utils from '@src/utils';
import { UserRequest } from '@src/interfaces/user.interface';
import { AdminRequest } from '@src/interfaces/admin.interface';
import * as Hapi from 'hapi';
import { LoanRequest } from '@src/interfaces/loan.interface';

const objectSchema = Joi.object({
	billingType: Joi.string().valid([
		Constant.DATABASE.BILLING_TYPE.YEARLY,
		Constant.DATABASE.BILLING_TYPE.MONTHLY,
	]),
	amount: Joi.number(),
});

export let adminProfileRoute: ServerRoute[] = [
	/**
	 * @description:Login via mail
	 */
	{
		method: 'POST',
		path: '/v1/admin/login',
		handler: async (request, h: Hapi.ResponseToolkit) => {
			try {
				const payload: AdminRequest.Login = request.payload as AdminRequest.Login;
				const registerResponse = await AdminProfileService.login(payload);
				return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.LOGIN, registerResponse));
			} catch (error) {
				utils.consolelog('Error', error, true);
				return (UniversalFunctions.sendError(error));
			}
		},
		options: {
			description: 'login to application',
			tags: ['api', 'anonymous', 'Admin', 'login'],
			auth: 'DoubleAuth',
			validate: {
				payload: {
					email: Joi.string().lowercase().email().trim().required(),
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
	 *
	 * @description: forget passsword to send the link over mail
	 */
	{
		method: 'PATCH',
		path: '/v1/admin/forgetPassword',
		handler: async (request, h) => {
			try {
				const payload: UserRequest.ForgetPassword = request.payload as AdminRequest.ForgetPassword;
				await AdminProfileService.forgetPassword(payload);
				return utils.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.FORGET_PASSWORD_EMAIL, {});
			} catch (error) {
				return UniversalFunctions.sendError(error);
			}
		},
		options: {
			description: 'forget-password to admin',
			tags: ['api', 'anonymous', 'admin', 'forget-password', 'link'],
			auth: 'DoubleAuth',
			validate: {
				payload: {
					email: Joi.string().lowercase().email().trim().required(),
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
	 * @description : update the admin Profile
	 */
	{
		method: 'PATCH',
		path: '/v1/admin/profile',
		handler: async (request, h) => {
			try {
				const adminData = request.auth && request.auth.credentials && (request.auth.credentials as any).adminData;
				const payload = request.payload as AdminRequest.ProfileUpdate;
				const responseData = await AdminProfileService.editProfile(payload, adminData);
				return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.UPDATED, responseData));
			} catch (error) {
				utils.consolelog('Error', error, true);
				return (UniversalFunctions.sendError(error));
			}
		},
		options: {
			description: 'update admin Profile',
			tags: ['api', 'anonymous', 'admin', 'update'],
			auth: 'AdminAuth',
			validate: {
				payload: {
					name: Joi.string().min(1).max(20).trim(),
					profilePicUrl: Joi.string().allow(''),
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
				utils.consolelog('Error', error, true);
				return (UniversalFunctions.sendError(error));
			}
		},
		options: {
			description: 'Get Admin Profile',
			tags: ['api', 'anonymous', 'admin', 'Detail'],
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
					link: Joi.string().required(),
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
				const payload: AdminRequest.ChangePassword = request.payload as AdminRequest.ChangePassword;
				const responseData = await AdminProfileService.changePassword(payload, adminData);
				return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.DEFAULT, responseData));
			} catch (error) {
				utils.consolelog('Error', error, true);
				return (UniversalFunctions.sendError(error));
			}
		},
		options: {
			description: 'Get admin Profile',
			tags: ['api', 'anonymous', 'admin', 'Detail'],
			auth: 'AdminAuth',
			validate: {
				payload: {
					oldPassword: Joi.string().min(6).max(16).trim(),
					newPassword: Joi.string().min(6).max(16).trim(),
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
				const payload = request.payload as AdminRequest.ResetPassword;
				const responseData = await AdminProfileService.verifyLinkForResetPwd(payload);
				return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.DEFAULT, responseData));
			} catch (error) {
				utils.consolelog('Error', error, true);
				return (UniversalFunctions.sendError(error));
			}
		},
		options: {
			description: 'update admin reset password',
			tags: ['api', 'anonymous', 'admin', 'reset'],
			validate: {
				payload: {
					token: Joi.string().required(),
					password: Joi.string().min(6).max(16).trim(),
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
		handler: async (request: Hapi.Request, h) => {
			try {
				const adminData = request.auth && request.auth.credentials && (request.auth.credentials as any).adminData;
				const payload: AdminRequest.AdminPropertyList = request.query as any;
				utils.consolelog('This request is on', `${request.path}with parameters ${JSON.stringify(payload)}`, true);
				// if (adminData.type === Constant.DATABASE.USER_TYPE.STAFF.TYPE) {
				// 	await AdminStaffEntity.checkPermission(payload.permissionType);
				// }
				const responseData = await AdminService.getProperty(payload);
				return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.DEFAULT, responseData));
			} catch (error) {
				utils.consolelog('Error', error, true);
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
						// Constant.DATABASE.PROPERTY_STATUS.EXPIRED.NUMBER,
					]),
					// permissionType: Joi.string().valid([
					// 	Constant.DATABASE.PERMISSION.TYPE.PROPERTIES,
					// 	// Constant.DATABASE.PERMISSION.TYPE.LOAN,
					// 	// Constant.DATABASE.PERMISSION.TYPE.DASHBOARD,
					// 	// Constant.DATABASE.PERMISSION.TYPE.HELP_CENTER,
					// ]),
					propertyType: Joi.string().trim().valid([
						Constant.DATABASE.PROPERTY_TYPE['APPARTMENT/CONDO'],
						Constant.DATABASE.PROPERTY_TYPE.COMMERCIAL,
						Constant.DATABASE.PROPERTY_TYPE.HOUSE_LOT,
						Constant.DATABASE.PROPERTY_TYPE.LAND,
						Constant.DATABASE.PROPERTY_TYPE.ROOM,
					]),
					label: Joi.array(),
					minPrice: Joi.number(),
					maxPrice: Joi.number(),
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
				const adminData = request.auth && request.auth.credentials && (request.auth.credentials as any).adminData;
				const payload: AdminRequest.PropertyDetail = request.params as any;
				utils.consolelog('This request is on', `${request.path}with parameters ${JSON.stringify(payload)}`, true);
				// if (adminData.type === Constant.DATABASE.USER_TYPE.STAFF.TYPE) {
				// 	await AdminStaffEntity.checkPermission(payload.permissionType);
				// }
				const responseData = await AdminService.getPropertyById(payload);
				return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.DEFAULT, responseData));
			} catch (error) {
				utils.consolelog('Error', error, true);
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
					// permissionType: Joi.string().valid([
					// 	Constant.DATABASE.PERMISSION.TYPE.PROPERTIES,
					// 	// Constant.DATABASE.PERMISSION.TYPE.ACTIVE_PROPERTIES,
					// 	// Constant.DATABASE.PERMISSION.TYPE.PENDING_PROPERTIES,
					// 	// Constant.DATABASE.PERMISSION.TYPE.DECLINED_PROPERTIES,
					// ]),
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
					// permissionType: (request.payload as any).permissionType,
				};
				// if (adminData.type === Constant.DATABASE.USER_TYPE.STAFF.TYPE) {
				// 	await AdminStaffEntity.checkPermission(payload.permissionType);
				// }
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
					// permissionType: Joi.string().valid([
					// 	Constant.DATABASE.PERMISSION.TYPE.PROPERTIES,
					// 	// Constant.DATABASE.PERMISSION.TYPE.ACTIVE_PROPERTIES,
					// 	// Constant.DATABASE.PERMISSION.TYPE.PENDING_PROPERTIES,
					// 	// Constant.DATABASE.PERMISSION.TYPE.DECLINED_PROPERTIES,
					// ]),
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
				utils.consolelog('Error', error, true);
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
				// if (adminData.type === Constant.DATABASE.USER_TYPE.STAFF.TYPE) {
				// 	await ENTITY.AdminStaffEntity.checkPermission(Constant.DATABASE.PERMISSION.TYPE.DASHBOARD);
				// }
				const registerResponse = await AdminService.dashboard(adminData);
				return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.DEFAULT, registerResponse));
			} catch (error) {
				utils.consolelog('Error', error, true);
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

	/***
	  * @description Admin loan listing
	 */
	{
		method: 'GET',
		path: '/v1/admin/loan',
		handler: async (request, h) => {
			try {
				const adminData = request.auth && request.auth.credentials && (request.auth.credentials as any).adminData;
				const payload: any = request.query;
				// if (adminData.type === Constant.DATABASE.USER_TYPE.STAFF.TYPE) {
				// 	await ENTITY.AdminStaffEntity.checkPermission(adminData.permission);
				// }
				const registerResponse = await LoanController.adminLoansList(payload, adminData);
				return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.DEFAULT, registerResponse));
			} catch (error) {
				utils.consolelog('Error', error, true);
				return (UniversalFunctions.sendError(error));
			}
		},
		options: {
			description: 'Admin loan list',
			tags: ['api', 'anonymous', 'admin', 'Detail'],
			auth: 'AdminAuth',
			validate: {
				query: {
					status: Joi.string().valid([
						// Constant.DATABASE.LOAN_APPLICATION_STATUS.PENDING,
						// Constant.DATABASE.LOAN_APPLICATION_STATUS.REJECTED,
						// Constant.DATABASE.LOAN_APPLICATION_STATUS.APPROVED,
						Constant.DATABASE.LOAN_APPLICATION_STATUS.BANK_APPROVED.value,
						Constant.DATABASE.LOAN_APPLICATION_STATUS.BANK_DECLINED.value,
						Constant.DATABASE.LOAN_APPLICATION_STATUS.NEW.value,
						// Constant.DATABASE.LOAN_APPLICATION_STATUS.DRAFT.value,
						Constant.DATABASE.LOAN_APPLICATION_STATUS.NOOK_DECLINED.value,
						Constant.DATABASE.LOAN_APPLICATION_STATUS.NOOK_REVIEW.value,
						Constant.DATABASE.LOAN_APPLICATION_STATUS.REFERRED.value,
					]),
					amountFrom: Joi.number(),
					amountTo: Joi.number(),
					fromDate: Joi.number(),
					toDate: Joi.number(),
					sortBy: Joi.string().default('createdAt'),
					// sortType: Joi.string(),
					limit: Joi.number(),
					page: Joi.number().min(1).default(1),
					// type: Joi.string().valid('admin', 'user')
					searchTerm: Joi.string(),
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
	/***
	*@description : admin update the loan status
	 */
	{
		method: 'PATCH',
		path: '/v1/admin/loan/{loanId}/{status}',
		handler: async (request, h) => {
			try {
				const adminData = request.auth && request.auth.credentials && (request.auth.credentials as any).adminData;
				const payload: AdminRequest.IUpdateLoanRequest = request.params as any;
				// if (adminData.type === Constant.DATABASE.USER_TYPE.STAFF.TYPE) {
				// 	await AdminStaffEntity.checkPermission(payload.permission);
				// }
				const registerResponse = await LoanController.adminUpdateLoanStatus(payload, adminData);
				return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.DEFAULT, registerResponse));
			} catch (error) {
				utils.consolelog('Error', error, true);
				return (UniversalFunctions.sendError(error));
			}
		},
		options: {
			description: 'Admin update loan status',
			tags: ['api', 'anonymous', 'admin', 'loan', 'status'],
			auth: 'AdminAuth',
			validate: {
				params: {
					loanId: Joi.string(),
					status: Joi.string().valid([
						// Constant.DATABASE.LOAN_APPLICATION_STATUS.PENDING,
						// Constant.DATABASE.LOAN_APPLICATION_STATUS.REJECTED,
						// Constant.DATABASE.LOAN_APPLICATION_STATUS.APPROVED,
						Constant.DATABASE.LOAN_APPLICATION_STATUS.BANK_APPROVED.value,
						Constant.DATABASE.LOAN_APPLICATION_STATUS.BANK_DECLINED.value,
						Constant.DATABASE.LOAN_APPLICATION_STATUS.NEW.value,
						Constant.DATABASE.LOAN_APPLICATION_STATUS.DRAFT.value,
						Constant.DATABASE.LOAN_APPLICATION_STATUS.NOOK_DECLINED.value,
						Constant.DATABASE.LOAN_APPLICATION_STATUS.NOOK_REVIEW.value,
						Constant.DATABASE.LOAN_APPLICATION_STATUS.REFERRED.value,
					]),
					// type: Joi.string().valid('admin', 'user')
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
	/***
	 *@description : admin get the loan
	 */
	{
		method: 'GET',
		path: '/v1/admin/loan/{loanId}',
		handler: async (request, h) => {
			try {
				const adminData = request.auth && request.auth.credentials && (request.auth.credentials as any).adminData;
				const payload: LoanRequest.LoanById = request.params as any;
				// if (adminData.type === Constant.DATABASE.USER_TYPE.STAFF.TYPE) {
				// 	await AdminStaffEntity.checkPermission(payload.permission);
				// }
				const registerResponse = await LoanController.loanById(payload, adminData);
				return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.DEFAULT, registerResponse));
			} catch (error) {
				utils.consolelog('Error', error, true);
				return (UniversalFunctions.sendError(error));
			}
		},
		options: {
			description: 'Admin update loan status',
			tags: ['api', 'anonymous', 'admin', 'loan', 'status'],
			auth: 'AdminAuth',
			validate: {
				params: {
					loanId: Joi.string(),
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
	 * @description subscription list
	 */
	{
		method: 'POST',
		path: '/v1/admin/subscriptionList',
		handler: async (request, h) => {
			try {
				const adminData = request.auth && request.auth.credentials && (request.auth.credentials as any).adminData;
				const payload = request.payload as any;
				// if (adminData.type === Constant.DATABASE.USER_TYPE.STAFF.TYPE) {
				// 	await AdminStaffEntity.checkPermission(payload.permission);
				// }
				const data = await AdminService.subscriptionList(payload);
				return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.DEFAULT, data));
			} catch (error) {
				utils.consolelog('Error', error, true);
				return (UniversalFunctions.sendError(error));
			}
		},
		options: {
			description: 'Admin update loan status',
			tags: ['api', 'anonymous', 'admin', 'loan', 'status'],
			auth: 'AdminAuth',
			validate: {
				payload: {
					featuredType: Joi.string().valid([
						Constant.DATABASE.FEATURED_TYPE.FREE,
						Constant.DATABASE.FEATURED_TYPE.HOMEPAGE,
						Constant.DATABASE.FEATURED_TYPE.PROFILE,
						Constant.DATABASE.FEATURED_TYPE.PROPERTY,
					]),
					plans: Joi.array().items(objectSchema),
					description: Joi.string(),
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
		path: '/v1/user/subscriptionList',
		handler: async (request, h) => {
			try {
				const data = await AdminService.getSubscriptionList();
				return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.DEFAULT, data));
			} catch (error) {
				utils.consolelog('Error', error, true);
				return (UniversalFunctions.sendError(error));
			}
		},
		options: {
			description: 'Admin update loan status',
			tags: ['api', 'anonymous', 'admin', 'loan', 'status'],
			auth: 'DoubleAuth',
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
	 * @description update the description list
	 */
	{
		method: 'PATCH',
		path: '/v1/admin/subscriptionList/{id}',
		handler: async (request, h) => {
			try {
				const adminData = request.auth && request.auth.credentials && (request.auth.credentials as any).adminData;
				const payload = {
					...request.params as any,
					...request.payload as any,
				};
				// if (adminData.type === Constant.DATABASE.USER_TYPE.STAFF.TYPE) {
				// 	await AdminStaffEntity.checkPermission(payload.permission);
				// }
				const data = await AdminService.updateSubscription(payload);
				return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.DEFAULT, data));
			} catch (error) {
				utils.consolelog('Error', error, true);
				return (UniversalFunctions.sendError(error));
			}
		},
		options: {
			description: 'Admin update loan status',
			tags: ['api', 'anonymous', 'admin', 'loan', 'status'],
			auth: 'AdminAuth',
			validate: {
				params: {
					id: Joi.string(),
				},
				payload: {
					featuredType: Joi.string().valid([
						Constant.DATABASE.FEATURED_TYPE.FREE,
						Constant.DATABASE.FEATURED_TYPE.HOMEPAGE,
						Constant.DATABASE.FEATURED_TYPE.PROFILE,
						Constant.DATABASE.FEATURED_TYPE.PROPERTY,
					]),
					description: Joi.string(),
					plans: Joi.array().items(objectSchema),
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
