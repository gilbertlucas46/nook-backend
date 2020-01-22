import * as Joi from 'joi';

import { ServerRoute, ResponseToolkit } from 'hapi';
import * as UniversalFunctions from '@src/utils';
import * as Constant from '@src/constants/app.constant';
import { subscriptionController } from '@src/controllers';
import { AdminService, UserService } from '../../controllers';

export let subscriptionRoute: ServerRoute[] = [
	// {
	// 	method: 'GET',
	// 	path: '/v1/subscription',
	// 	handler: async (request, h: ResponseToolkit) => {
	// 		try {
	// 			const query = request.query;
	// 			const data = await subscriptionController.subscriptionList(query);
	// 			return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.DEFAULT, data));
	// 		} catch (error) {
	// 			return (UniversalFunctions.sendError(error));
	// 		}
	// 	},
	// 	options: {
	// 		description: 'subscription cost list',
	// 		tags: ['api', 'subscription'],
	// 		auth: 'DoubleAuth',
	// 		validate: {
	// 			query: {
	// 				type: Joi.string().valid([
	// 					Constant.DATABASE.BILLING_TYPE.MONTHLY,
	// 					Constant.DATABASE.BILLING_TYPE.YEARLY,
	// 				]).required(),
	// 			},
	// 			headers: UniversalFunctions.authorizationHeaderObj,
	// 			failAction: UniversalFunctions.failActionFunction,
	// 		},
	// 		plugins: {
	// 			'hapi-swagger': {
	// 				responseMessages: Constant.swaggerDefaultResponseMessages,
	// 			}
	// 		}
	// 	}
	// }
	{
		method: 'GET',
		path: '/v1/admin/subscriptionList',
		handler: async (request, h) => {
			try {
				const adminData = request.auth && request.auth.credentials && (request.auth.credentials as any).adminData;
				const payload = request.payload as any;
				// if (adminData.type === Constant.DATABASE.USER_TYPE.STAFF.TYPE) {
				// 	await AdminStaffEntity.checkPermission(payload.permission);
				// }
				const data = await AdminService.getSubscriptionList();
				return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.DEFAULT, data));
			} catch (error) {
				// utils.consolelog('Error', error, true);
				return (UniversalFunctions.sendError(error));
			}
		},
		options: {
			description: 'Admin update loan status',
			tags: ['api', 'anonymous', 'admin', 'loan', 'status'],
			auth: 'AdminAuth',
			validate: {
				// payload: {
				// },
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
	 * @description user active subscriptionList
	 */
	{
		method: 'GET',
		path: '/v1/user/subscription',
		handler: async (request, h) => {
			try {
				const userData = request.auth && request.auth.credentials && (request.auth.credentials as any).userData;
				console.log('userDatauserData', userData);
				const payload = request.query as any;
				// if (adminData.type === Constant.DATABASE.USER_TYPE.STAFF.TYPE) {
				// 	await AdminStaffEntity.checkPermission(payload.permission);
				// }
				const data = await subscriptionController.activeSubscriptionList(userData);
				return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.DEFAULT, data));
			} catch (error) {
				// utils.consolelog('Error', error, true);
				return (UniversalFunctions.sendError(error));
			}
		},
		options: {
			description: 'user active subscription list',
			tags: ['api', 'anonymous', 'user', 'subscription'],
			auth: 'UserAuth',
			validate: {
				// query: {
				// },
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
		path: '/v1/user/dashboard/subscriptions',
		handler: async (request, h) => {
			try {
				const userData = request.auth && request.auth.credentials && (request.auth.credentials as any).userData;
				const payload = request.query as any;
				// if (adminData.type === Constant.DATABASE.USER_TYPE.STAFF.TYPE) {
				// 	await AdminStaffEntity.checkPermission(payload.permission);
				// }
				const data = await subscriptionController.userDashboard(payload, userData);
				return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.DEFAULT, data));
			} catch (error) {
				console.log('Error', error, true);
				return (UniversalFunctions.sendError(error));
			}
		},
		options: {
			description: 'user active subscription list',
			tags: ['api', 'anonymous', 'user', 'subscription'],
			auth: 'UserAuth',
			validate: {
				// query: {
				// },
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
		path: '/v1/user/subscriptions/{id}',
		handler: async (request, h) => {
			try {
				const userData = request.auth && request.auth.credentials && (request.auth.credentials as any).userData;
				const payload = request.params as any;
				const data = await subscriptionController.cancelSubscription(payload, userData);
				return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.DEFAULT, {}));
			} catch (error) {
				console.log('Error', error, true);
				return (UniversalFunctions.sendError(error));
			}
		},
		options: {
			description: 'user cancel subscription cancel auto',
			tags: ['api', 'anonymous', 'user', 'subscription'],
			auth: 'UserAuth',
			validate: {
				params: {
					id: Joi.string().regex(/^[0-9a-fA5-F]{24}$/),
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
		path: '/v1/user/subscription/property',
		handler: async (request, h) => {
			try {
				const userData = request.auth && request.auth.credentials && (request.auth.credentials as any).userData;
				console.log('userDatauserData', userData);
				const payload = request.query as any;
				// if (adminData.type === Constant.DATABASE.USER_TYPE.STAFF.TYPE) {
				// 	await AdminStaffEntity.checkPermission(payload.permission);
				// }
				const data = await subscriptionController.userSubscriptionProperty(userData, payload);
				return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.DEFAULT, data));
			} catch (error) {
				// utils.consolelog('Error', error, true);
				return (UniversalFunctions.sendError(error));
			}
		},
		options: {
			description: 'user active subscription list',
			tags: ['api', 'anonymous', 'user', 'subscription'],
			auth: 'UserAuth',
			validate: {
				query: {
					limit: Joi.number(),
					page: Joi.number(),
					sortBy: Joi.string(),
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
