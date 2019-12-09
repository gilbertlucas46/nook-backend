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
		CONSTANT.DATABASE.PERMISSION.TYPE.PROPERTIES,
		CONSTANT.DATABASE.PERMISSION.TYPE.LOAN,
		CONSTANT.DATABASE.PERMISSION.TYPE.HELP_CENTER,
		CONSTANT.DATABASE.PERMISSION.TYPE.ARTICLE,
		CONSTANT.DATABASE.PERMISSION.TYPE.USERS,
		CONSTANT.DATABASE.PERMISSION.TYPE.STAFF,
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
				const registerResponse = await AdminStaffController.createStaff(payload);
				return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.LOGIN, registerResponse));
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
					email: Joi.string().email().required(),
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

    /**
     * @description This Api is used to get list of all user based on filters.
     */

    {
		method: 'GET',
		path: '/v1/admin/userlist',
		handler: async (request, h) => {
			try {
				const adminData = request.auth && request.auth.credentials && (request.auth.credentials as any).adminData;
				const payload: any = request.query;
				// if (adminData.type === CONSTANT.DATABASE.USER_TYPE.STAFF.TYPE) {
				// 	await ENTITY.AdminStaffEntity.checkPermission(payload.permission);
				// }
				const registerResponse = await AdminStaffController.getStaffList(payload);
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
				query: {
					page: Joi.number(),
					limit: Joi.number(),
					sortBy: Joi.string().allow('createdAt'),
					// permission: Joi.string().valid([
					// 	CONSTANT.DATABASE.PERMISSION.TYPE.STAFF,
					// ]).required(),
					permissionType: Joi.string().valid([
						CONSTANT.DATABASE.PERMISSION.TYPE.DASHBOARD,
						CONSTANT.DATABASE.PERMISSION.TYPE.PROPERTIES,
						CONSTANT.DATABASE.PERMISSION.TYPE.LOAN,
						CONSTANT.DATABASE.PERMISSION.TYPE.HELP_CENTER,
						CONSTANT.DATABASE.PERMISSION.TYPE.ARTICLE,
						CONSTANT.DATABASE.PERMISSION.TYPE.USERS,
						CONSTANT.DATABASE.PERMISSION.TYPE.STAFF,
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
]