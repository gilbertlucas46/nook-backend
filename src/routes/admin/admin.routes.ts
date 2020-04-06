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
			// auth: 'DoubleAuth',
			validate: {
				payload: {
					email: Joi.string().email().lowercase().trim().required(),
					password: Joi.string().min(6).max(16).trim().required(),
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
					email: Joi.string().email().lowercase().trim().required(),
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
			description: 'admin dashboard',
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
				const checkPermission = adminData['permission'].some(data => {
					return data.moduleName === Constant.DATABASE.PERMISSION.TYPE.LOAN;
				});
				if (checkPermission === false) {
					return UniversalFunctions.sendError(Constant.STATUS_MSG.ERROR.E401.UNAUTHORIZED);
				}
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
				const checkPermission = adminData['permission'].some(data => {
					return data.moduleName === Constant.DATABASE.PERMISSION.TYPE.LOAN;
				});
				if (checkPermission === false) {
					return UniversalFunctions.sendError(Constant.STATUS_MSG.ERROR.E401.UNAUTHORIZED);
				}
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
				const checkPermission = adminData['permission'].some(data => {
					return data.moduleName === Constant.DATABASE.PERMISSION.TYPE.LOAN;
				});
				if (checkPermission === false) {
					return UniversalFunctions.sendError(Constant.STATUS_MSG.ERROR.E401.UNAUTHORIZED);
				}

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
	 * @description admin preQualification banks list
	 */
	{
		method: 'GET',
		path: '/v1/admin/prequalification',
		handler: async (request, h) => {
			try {
				const adminData = request.auth && request.auth.credentials && (request.auth.credentials as any).adminData;
				const payload: any = request.query;
				// if (adminData.type === Constant.DATABASE.USER_TYPE.STAFF.TYPE) {
				// 	await ENTITY.AdminStaffEntity.checkPermission(adminData.permission);
				// }
				// const checkPermission = adminData['permission'].some(data => {
				// 	return data.moduleName === Constant.DATABASE.PERMISSION.TYPE.LOAN;
				// });
				// if (checkPermission === false) {
				// 	return UniversalFunctions.sendError(Constant.STATUS_MSG.ERROR.E401.UNAUTHORIZED);
				// }
				const data = await LoanController.preQualificationList(payload, adminData);
				return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.DEFAULT, data));
			} catch (error) {
				utils.consolelog('Error', error, true);
				return (UniversalFunctions.sendError(error));
			}
		},
		options: {
			description: 'Admin preQualification bank list',
			tags: ['api', 'anonymous', 'admin', 'Detail'],
			auth: 'AdminAuth',
			validate: {
				query: {
					// userId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
					fromDate: Joi.number(),
					toDate: Joi.number(),
					sortType: Joi.number().valid([Constant.ENUM.SORT_TYPE]).default(-1),
					propertyValue: Joi.number(),
					propertyType: Joi.string(),
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
		method: 'GET',
		path: '/v1/admin/prequalification/{id}',
		handler: async (request, h) => {
			try {
				const adminData = request.auth && request.auth.credentials && (request.auth.credentials as any).adminData;
				const payload: any = request.params;
				// if (adminData.type === Constant.DATABASE.USER_TYPE.STAFF.TYPE) {
				// 	await ENTITY.AdminStaffEntity.checkPermission(adminData.permission);
				// }
				// const checkPermission = adminData['permission'].some(data => {
				// 	return data.moduleName === Constant.DATABASE.PERMISSION.TYPE.LOAN;
				// });
				// if (checkPermission === false) {
				// 	return UniversalFunctions.sendError(Constant.STATUS_MSG.ERROR.E401.UNAUTHORIZED);
				// }
				const data = await LoanController.preQualificationDetail(payload);
				return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.DEFAULT, data));
			} catch (error) {
				utils.consolelog('Error', error, true);
				return (UniversalFunctions.sendError(error));
			}
		},
		options: {
			description: 'Admin preQualification by Id',
			tags: ['api', 'anonymous', 'admin', 'Detail'],
			auth: 'AdminAuth',
			validate: {
				params: {
					id: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
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
	 * @description update the description list
	 */

];
