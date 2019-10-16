import { ServerRoute } from 'hapi';
import * as Joi from 'joi';
import * as ENTITY from '../../entity';
import * as UniversalFunctions from '../../utils';
import * as Constant from '../../constants';
import * as CONSTANT from '../../constants';
import { AdminStaffController } from '../../controllers';
import * as config from 'config';

export let subAdminRoutes: ServerRoute[] = [
	{
		method: 'POST',
		path: '/v1/staff',
		handler: async (request, h) => {
			try {
				const adminData = request.auth && request.auth.credentials && (request.auth.credentials as any).adminData;
				const payload: any = request.payload;
				const registerResponse = await AdminStaffController.createStaff(payload);
				return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.LOGIN, registerResponse));
			} catch (error) {
				return (UniversalFunctions.sendError(error));
			}
		},
		options: {
			description: 'Create staff member',
			tags: ['api', 'anonymous', 'Admin', 'staff_member'],
			auth: 'AdminAuth',
			validate: {
				payload: {
					email: Joi.string().email({ minDomainAtoms: 2 }).required(),
					firstName: Joi.string().min(1).max(32).required(),
					lastName: Joi.string().min(1).max(32).required(),
					phoneNumber: Joi.string().min(10).max(15)
				},
				headers: UniversalFunctions.authorizationHeaderObj,
				failAction: UniversalFunctions.failActionFunction
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
		path: '/v1/staff/permission',
		handler: async (request, h) => {
			try {
				const adminData = request.auth && request.auth.credentials && (request.auth.credentials as any).adminData;
				const payload: any = request.payload;
				await AdminStaffController.addPermissions(payload);
				return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.DEFAULT, {}));
			} catch (error) {
				return (UniversalFunctions.sendError(error));
			}
		},
		options: {
			description: 'Create staff member',
			tags: ['api', 'anonymous', 'Admin', 'staff_member'],
			auth: 'AdminAuth',
			validate: {
				payload: {
					_id: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
					permission: Joi.array().items(Joi.string().valid([
						CONSTANT.DATABASE.PERMISSION.TYPE.ARTICLE,
						CONSTANT.DATABASE.PERMISSION.TYPE.USERS,
						CONSTANT.DATABASE.PERMISSION.TYPE.STAFF,
						CONSTANT.DATABASE.PERMISSION.TYPE.PROPERTY,
					])).required()
				},
				headers: UniversalFunctions.authorizationHeaderObj,
				failAction: UniversalFunctions.failActionFunction
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
		path: '/v1/staff/resend',
		handler: async (request, h) => {
			try {
				const adminData = request.auth && request.auth.credentials && (request.auth.credentials as any).adminData;
				const payload: any = request.payload;
				await AdminStaffController.systemGeneratedMail(payload);
				return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.DEFAULT, {}));
			} catch (error) {
				return (UniversalFunctions.sendError(error));
			}
		},
		options: {
			description: 'Create staff member',
			tags: ['api', 'anonymous', 'Admin', 'staff_member'],
			// auth: 'AdminAuth',
			validate: {
				payload: {
					_id: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
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
		method: 'DELETE',
		path: '/v1/staff/delete/{_id}',
		handler: async (request, h) => {
			try {
				const adminData = request.auth && request.auth.credentials && (request.auth.credentials as any).adminData;
				console.log(adminData, "!!!!!!!!!");
				const payload: any = request.params;
				await AdminStaffController.deleteStaff(payload, adminData);
				return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.DELETED, {}));

			} catch (error) {
				UniversalFunctions.consolelog('error', error, true);
				return (UniversalFunctions.sendError(error));
			}
		},
		options: {
			description: 'delete Staff member',
			tags: ['api', 'anonymous', 'admin', 'Articl Staff'],
			auth: 'AdminAuth',
			validate: {
				params: {
					_id: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
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
		path: '/v1/staff',
		handler: async (request, h) => {
			try {
				const adminData = request.auth && request.auth.credentials && (request.auth.credentials as any).adminData;
				const payload: any = request.query;
				if (adminData.type === CONSTANT.DATABASE.USER_TYPE.STAFF.TYPE) {
					await ENTITY.AdminStaffEntity.checkPermission(payload.permission);
				}
				const registerResponse = await AdminStaffController.getStaffList(payload);
				return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.DEFAULT, registerResponse));
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
					page: Joi.number(),
					limit: Joi.number(),
					sortBy: Joi.string(),
					permission: Joi.string().valid([
						CONSTANT.DATABASE.PERMISSION.TYPE.STAFF
					]).required(),
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