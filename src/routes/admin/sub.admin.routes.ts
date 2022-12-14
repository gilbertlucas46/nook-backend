import { ServerRoute } from 'hapi';
import * as Joi from 'joi';
import * as UniversalFunctions from '../../utils';
import * as Constant from '../../constants';
import * as CONSTANT from '../../constants';
import { AdminStaffController } from '../../controllers';
import { AdminProfileService } from '@src/controllers/admin/adminProfile.controller';
import { AdminRequest } from '@src/interfaces/admin.interface';
const objectSchema = Joi.object({
	moduleName: Joi.string().min(1).valid([
		CONSTANT.DATABASE.PERMISSION.TYPE.DASHBOARD,
		// CONSTANT.DATABASE.PERMISSION.TYPE.PROPERTIES,
		CONSTANT.DATABASE.PERMISSION.TYPE.LOAN,
		CONSTANT.DATABASE.PERMISSION.TYPE.HELP_CENTER,
		CONSTANT.DATABASE.PERMISSION.TYPE.ARTICLE,
		CONSTANT.DATABASE.PERMISSION.TYPE.USERS,
		CONSTANT.DATABASE.PERMISSION.TYPE.STAFF,
		CONSTANT.DATABASE.PERMISSION.TYPE.Article_Category,

		// CONSTANT.DATABASE.PERMISSION.TYPE.Subscriptions,
		CONSTANT.DATABASE.PERMISSION.TYPE.loanReferrals,
		CONSTANT.DATABASE.PERMISSION.TYPE.PRE_QUALIFICATION,

		CONSTANT.DATABASE.PERMISSION.TYPE.HELPCENTER_BANK,
		CONSTANT.DATABASE.PERMISSION.TYPE.HELPCENTER_STAFF,
		CONSTANT.DATABASE.PERMISSION.TYPE.HELPCENTER_USER,
		CONSTANT.DATABASE.PERMISSION.TYPE.REFERRAL_PARTNER,
		// CONSTANT.DATABASE.PERMISSION.TYPE.ENQUIRY,
	]).required(),
	accessLevel: Joi.number().valid([CONSTANT.PRIVILEGE.SUB_ADMIN_PRIVILEGE]).default(2),
});

export let subAdminRoutes: ServerRoute[] = [
	{
		method: 'POST',
		path: '/v1/admin/staff',
		handler: async (request, h) => {
			try {
				const adminData = request.auth && request.auth.credentials && (request.auth.credentials as any).adminData;
				const payload: AdminRequest.IaddSubAdmin = request.payload as AdminRequest.IaddSubAdmin;

				// const checkPermission = adminData['permission'].some(data => {
				// 	return data.moduleName === Constant.DATABASE.PERMISSION.TYPE.STAFF;
				// });
				// if (checkPermission === false) {
				// 	return UniversalFunctions.sendError(Constant.STATUS_MSG.ERROR.E401.UNAUTHORIZED);
				// }
				const permission = await UniversalFunctions.checkPermission(adminData, Constant.DATABASE.PERMISSION.TYPE.STAFF);

				const registerResponse = await AdminStaffController.createStaff(payload);
				return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S201.CREATED, {}));
			} catch (error) {
				UniversalFunctions.consolelog('error', error, true);
				return (UniversalFunctions.sendError(error));
			}
		},
		options: {
			description: 'Create staff member',
			tags: ['api', 'anonymous', 'Admin', 'staff_member'],
			auth: 'AdminAuth',
			validate: {
				payload: {
					email: Joi.string().email().required().lowercase(),
					firstName: Joi.string().min(1).max(32).required(),
					lastName: Joi.string().min(1).max(32).required(),
					phoneNumber: Joi.string().min(7).max(15),
					permission: Joi.array().items(objectSchema).min(1).unique(),
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
		path: '/v1/admin/staff/{id}',
		handler: async (request, h) => {
			try {
				const adminData = request.auth && request.auth.credentials && (request.auth.credentials as any).adminData;
				const payload: AdminRequest.IadminUpdatePermission = {
					...request.payload as any,
					...request.params,
				};
				// const checkPermission = adminData['permission'].some(data => {
				// 	return data.moduleName === Constant.DATABASE.PERMISSION.TYPE.STAFF;
				// });
				// if (checkPermission === false) {
				// 	return UniversalFunctions.sendError(Constant.STATUS_MSG.ERROR.E401.UNAUTHORIZED);
				// }

				const permission = await UniversalFunctions.checkPermission(adminData, Constant.DATABASE.PERMISSION.TYPE.STAFF);


				const data = await AdminStaffController.updateStaff(payload);
				return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.DEFAULT, data));
			} catch (error) {
				UniversalFunctions.consolelog('error', error, true);
				return (UniversalFunctions.sendError(error));
			}
		},
		options: {
			description: 'update staff member',
			tags: ['api', 'anonymous', 'Admin', 'staff_member', 'update'],
			auth: 'AdminAuth',
			validate: {
				params: {
					id: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
				},
				payload: {
					firstName: Joi.string().min(1).max(32),
					lastName: Joi.string().min(1).max(32),
					phoneNumber: Joi.string().min(7).max(15),
					permission: Joi.array().items(objectSchema).min(1).unique(),
					status: Joi.string().valid([
						CONSTANT.DATABASE.STATUS.ADMIN.ACTIVE,
						CONSTANT.DATABASE.STATUS.ADMIN.BLOCKED,
						// CONSTANT.DATABASE.STATUS.ADMIN.PENDING,
						CONSTANT.DATABASE.STATUS.ADMIN.DELETE,
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
	{
		method: 'PATCH',
		path: '/v1/staff/admin/resend',
		handler: async (request, h) => {
			try {
				const adminData = request.auth && request.auth.credentials && (request.auth.credentials as any).adminData;
				const payload: any = request.payload;
				const permission = await UniversalFunctions.checkPermission(adminData, Constant.DATABASE.PERMISSION.TYPE.STAFF);

				await AdminStaffController.systemGeneratedMail(payload);
				return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.DEFAULT, {}));
			} catch (error) {
				UniversalFunctions.consolelog('error', error, true);
				return (UniversalFunctions.sendError(error));
			}
		},
		options: {
			description: 'staff resend request',
			tags: ['api', 'anonymous', 'Admin', 'staff_member'],
			auth: 'AdminAuth',
			validate: {
				payload: {
					adminId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
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
	 * @description :Admin Staff Listing
	 */
	{
		method: 'GET',
		path: '/v1/admin/staff',
		handler: async (request, h) => {
			try {
				const adminData = request.auth && request.auth.credentials && (request.auth.credentials as any).adminData;
				const payload: any = request.query;
				// if (adminData.type === CONSTANT.DATABASE.USER_TYPE.STAFF.TYPE) {
				// 	await ENTITY.AdminStaffEntity.checkPermission(payload.permission);
				// }
				// const checkPermission = adminData['permission'].some(data => {
				// 	return data.moduleName === Constant.DATABASE.PERMISSION.TYPE.STAFF;
				// });
				// if (checkPermission === false) {
				// 	return UniversalFunctions.sendError(Constant.STATUS_MSG.ERROR.E401.UNAUTHORIZED);
				// }
				const permission = await UniversalFunctions.checkPermission(adminData, Constant.DATABASE.PERMISSION.TYPE.STAFF);

				const registerResponse = await AdminStaffController.getStaffList(payload);
				return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.DEFAULT, registerResponse));
			} catch (error) {
				UniversalFunctions.consolelog('error', error, true);
				return (UniversalFunctions.sendError(error));
			}
		},
		options: {
			description: 'Get Admin Staff',
			tags: ['api', 'anonymous', 'admin', 'staff'],
			auth: 'AdminAuth',
			validate: {
				query: {
					page: Joi.number(),
					limit: Joi.number(),
					sortBy: Joi.string().allow('updatedAt'),
					permissionType: Joi.string().valid([
						CONSTANT.DATABASE.PERMISSION.TYPE.DASHBOARD,
						CONSTANT.DATABASE.PERMISSION.TYPE.LOAN,
						CONSTANT.DATABASE.PERMISSION.TYPE.HELP_CENTER,
						CONSTANT.DATABASE.PERMISSION.TYPE.ARTICLE,
						CONSTANT.DATABASE.PERMISSION.TYPE.USERS,
						CONSTANT.DATABASE.PERMISSION.TYPE.STAFF,
						CONSTANT.DATABASE.PERMISSION.TYPE.loanReferrals,
						CONSTANT.DATABASE.PERMISSION.TYPE.Article_Category,
					]),
					status: Joi.string().valid([
						CONSTANT.DATABASE.STATUS.ADMIN.ACTIVE,
						CONSTANT.DATABASE.STATUS.ADMIN.BLOCKED,
						// CONSTANT.DATABASE.STATUS.ADMIN.PENDING,
						CONSTANT.DATABASE.STATUS.ADMIN.DELETE,
					]),
					sortType: Joi.number().valid(Constant.ENUM.SORT_TYPE),
					searchTerm: Joi.string(),
					fromDate: Joi.number(),
					toDate: Joi.number(),
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
	 * @description :Admin Staff Listing
	 */
	{
		method: 'GET',
		path: '/v1/admin/staff/{id}',
		handler: async (request, h) => {
			try {
				const adminData = request.auth && request.auth.credentials && (request.auth.credentials as any).adminData;
				const payload: any = request.params;

				const permission = await UniversalFunctions.checkPermission(adminData, Constant.DATABASE.PERMISSION.TYPE.STAFF);

				const registerResponse = await AdminProfileService.profile(payload);
				return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.DEFAULT, registerResponse));
			} catch (error) {
				UniversalFunctions.consolelog('error', error, true);
				return (UniversalFunctions.sendError(error));
			}
		},
		options: {
			description: 'Get Admin Profile',
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
];