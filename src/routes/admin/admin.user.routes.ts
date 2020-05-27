import { ServerRoute } from 'hapi';
import * as Joi from 'joi';
import * as UniversalFunctions from '../../utils';
import * as Constant from '../../constants';
import { AdminUserController, UserService } from '../../controllers';
import { AdminRequest } from '@src/interfaces/admin.interface';

export let adminUserRoutes: ServerRoute[] = [
	{
		method: 'POST',
		path: '/v1/admin/users',
		handler: async (request, h) => {
			try {
				const adminData = request.auth && request.auth.credentials && (request.auth.credentials as any).adminData;
				const payload = request.payload as AdminRequest.IAddUser;
				// const checkPermission = adminData['permission'].some(data => {
				// 	return data.moduleName === Constant.DATABASE.PERMISSION.TYPE.USERS;
				// });
				// if (checkPermission === false) {
				// 	return UniversalFunctions.sendError(Constant.STATUS_MSG.ERROR.E401.UNAUTHORIZED);
				// }
				const permission = await UniversalFunctions.checkPermission(adminData, Constant.DATABASE.PERMISSION.TYPE.USERS);

				const registerResponse = await AdminUserController.addUser(payload);
				return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S201.CREATED, registerResponse));
			} catch (error) {
				UniversalFunctions.consolelog('error', error, true);
				return (UniversalFunctions.sendError(error));
			}
		},
		options: {
			description: 'Create user',
			tags: ['api', 'anonymous', 'Admin', 'user'],
			auth: 'AdminAuth',
			validate: {
				payload: {
					email: Joi.string().lowercase().email().trim().required(),
					userName: Joi.string().lowercase().trim().required(),
					firstName: Joi.string().min(3).max(30).trim().required(),
					middleName: Joi.string().trim().allow('').required(),
					lastName: Joi.string().min(3).max(30).trim().required(),
					phoneNumber: Joi.string().min(7).max(15).trim().required(),
					// type: Joi.string().valid([
					// 	Constant.DATABASE.USER_TYPE.AGENT.TYPE,
					// 	Constant.DATABASE.USER_TYPE.TENANT.TYPE,
					// 	Constant.DATABASE.USER_TYPE.OWNER.TYPE,
					// ]),
					faxNumber: Joi.string().allow(''),
					language: Joi.string().allow(''),
					title: Joi.string().allow(''),
					license: Joi.string().allow(''),
					companyName: Joi.string().allow(''),
					address: Joi.string().allow(''),
					aboutMe: Joi.string().allow(''),
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
		path: '/v1/admin/users',
		handler: async (request, h) => {
			try {
				const adminData = request.auth && request.auth.credentials && (request.auth.credentials as any).adminData;
				const payload: AdminRequest.IGetUSerList = request.query as any;
				// const checkPermission = adminData['permission'].some(data => {
				// 	return data.moduleName === Constant.DATABASE.PERMISSION.TYPE.USERS;
				// });
				// if (checkPermission === false) {
				// 	return UniversalFunctions.sendError(Constant.STATUS_MSG.ERROR.E401.UNAUTHORIZED);
				// }
				const permission = await UniversalFunctions.checkPermission(adminData, Constant.DATABASE.PERMISSION.TYPE.USERS);
				const registerResponse = await AdminUserController.getUserList(payload);
				return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.DEFAULT, registerResponse));
			} catch (error) {
				UniversalFunctions.consolelog('error', error, true);
				return (UniversalFunctions.sendError(error));
			}
		},
		options: {
			description: 'Get Admin user',
			tags: ['api', 'anonymous', 'admin', 'user'],
			auth: 'AdminAuth',
			validate: {
				query: {
					page: Joi.number(),
					limit: Joi.number(),
					sortBy: Joi.string(),
					status: Joi.string().valid([
						Constant.DATABASE.STATUS.ADMIN.ACTIVE,
						Constant.DATABASE.STATUS.ADMIN.BLOCKED,
						Constant.DATABASE.STATUS.ADMIN.DELETE,
					]),
					// type: Joi.string().valid([
					// 	Constant.DATABASE.USER_TYPE.AGENT.TYPE,
					// 	Constant.DATABASE.USER_TYPE.OWNER.TYPE,
					// 	Constant.DATABASE.USER_TYPE.TENANT.TYPE,
					// ]),
					sortType: Joi.number().valid(Constant.ENUM.SORT_TYPE),
					searchTerm: Joi.string(),
					fromDate: Joi.number(),
					toDate: Joi.number(),
					isByAdmin: Joi.boolean(),
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
	 * @description update user
	 */

	{
		method: 'Patch',
		path: '/v1/admin/users/{userId}/status',
		handler: async (request, h) => {
			try {
				const adminData = request.auth && request.auth.credentials && (request.auth.credentials as any).adminData;
				const payload = {
					...request.params,
					...request.payload as any,
				};
				// if (adminData.type === CONSTANT.DATABASE.USER_TYPE.STAFF.TYPE) {
				// 	await ENTITY.AdminStaffEntity.checkPermission(payload.permission);
				// }
				// const checkPermission = adminData['permission'].some(data => {
				// 	return data.moduleName === Constant.DATABASE.PERMISSION.TYPE.USERS;
				// });
				// if (checkPermission === false) {
				// 	return UniversalFunctions.sendError(Constant.STATUS_MSG.ERROR.E401.UNAUTHORIZED);
				// }
				const permission = await UniversalFunctions.checkPermission(adminData, Constant.DATABASE.PERMISSION.TYPE.USERS);


				const registerResponse = await AdminUserController.updateUserStatus(payload);
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
					userId: Joi.string(),
				},
				payload: {
					status: Joi.string().valid([
						Constant.DATABASE.STATUS.USER.ACTIVE,
						Constant.DATABASE.STATUS.USER.BLOCKED,
						Constant.DATABASE.STATUS.USER.DELETE,
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
		method: 'Patch',
		path: '/v1/admin/users/{userId}',
		handler: async (request, h) => {
			try {
				const adminData = request.auth && request.auth.credentials && (request.auth.credentials as any).adminData;
				const payload: AdminRequest.IUpdateUser = {
					...request.params,
					...request.payload as any,
				};
				// if (adminData.type === CONSTANT.DATABASE.USER_TYPE.STAFF.TYPE) {
				// 	await ENTITY.AdminStaffEntity.checkPermission(payload.permission);
				// }
				// const checkPermission = adminData['permission'].some(data => {
				// 	return data.moduleName === Constant.DATABASE.PERMISSION.TYPE.USERS;
				// });
				// if (checkPermission === false) {
				// 	return UniversalFunctions.sendError(Constant.STATUS_MSG.ERROR.E401.UNAUTHORIZED);
				// }
				const permission = await UniversalFunctions.checkPermission(adminData, Constant.DATABASE.PERMISSION.TYPE.USERS);


				const registerResponse = await AdminUserController.updateUser(payload);
				return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.DEFAULT, registerResponse));
			} catch (error) {
				UniversalFunctions.consolelog('error', error, true);
				return (UniversalFunctions.sendError(error));
			}
		},
		options: {
			description: 'update user Profile by admin',
			tags: ['api', 'anonymous', 'admin', 'user', 'update'],
			auth: 'AdminAuth',
			validate: {
				params: {
					userId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
				},
				payload: {
					userName: Joi.string().lowercase().required(),
					email: Joi.string().email().lowercase().required(),
					firstName: Joi.string(),
					middleName: Joi.string(),
					lastName: Joi.string(),
					phoneNumber: Joi.string(),
					language: Joi.string(),
					aboutMe: Joi.string(),
					profilePicUrl: Joi.string().uri(),
					backGroundImageUrl: Joi.string().uri(),
					// isEmailVerified: { type: Boolean },
					// isPhoneVerified: { type: Boolean },
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
	 *  @description add the user
	 */
	{
		method: 'Get',
		path: '/v1/admin/users/{userId}',
		handler: async (request, h) => {
			try {
				const adminData = request.auth && request.auth.credentials && (request.auth.credentials as any).adminData;
				console.log('adminDataadminDataadminDataadminData', adminData);

				const payload = {
					...request.params,
				};
				const permission = await UniversalFunctions.checkPermission(adminData, Constant.DATABASE.PERMISSION.TYPE.USERS);
				console.log('permissionpermission', permission);

				const registerResponse = await AdminUserController.adminGetUser(payload);
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
					userId: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
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
	 * @description admin add the coborrower info
	 */
	{
		method: 'GET',
		path: '/v1/admin/search-user',
		handler: async (request, h) => {
			try {
				const adminData = request.auth && request.auth.credentials && (request.auth.credentials as any).adminData;
				const payload = request.query as any;

				const data = await UserService.seacrhUserByAdmin(payload);
				return UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.DEFAULT, data);
			} catch (error) {
				UniversalFunctions.consolelog(error, 'error', true);
				return (UniversalFunctions.sendError(error));
			}
		},
		options: {
			description: 'Admin user search ',
			tags: ['api', 'anonymous', 'user', 'bank', 'add', 'prequalification'],
			auth: 'AdminAuth',
			validate: {
				query: {
					// preQualificationId: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
					searchTerm: Joi.string().trim().required(),
				},
				headers: UniversalFunctions.authorizationHeaderObj,
				failAction: UniversalFunctions.failActionFunction,
			},
		},
	},
];