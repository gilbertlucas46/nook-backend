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
				// const payload = request.payload as any;
				// if (adminData.type === Constant.DATABASE.USER_TYPE.STAFF.TYPE) {
				// 	await AdminStaffEntity.checkPermission(payload.permission);
				// }
				const data = await subscriptionController.activeSubscriptionList(userData)
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
];
