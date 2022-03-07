import * as Joi from 'joi';
import * as UniversalFunctions from '@src/utils';
import * as Constant from '@src/constants/app.constant';
import { ResponseToolkit, ServerRoute } from 'hapi';
import { NotificationController } from '@src/controllers/notification/notification.controller';
import { NotificationRequest } from '@src/interfaces/notification.interface';

export let notificationRoute: ServerRoute[]=[
    /**
	 * @author Shivam Singh
	 * @description: get notification on admin end
	 *
	 */
	{
		method: 'GET',
		path: '/v1/admin/notification',
		handler: async (request, h) => {
			try {
                const adminData = request.auth && request.auth.credentials && (request.auth.credentials as any).adminData;
				const payload:NotificationRequest.INotificationList=request.query as any;
			    const permission = await UniversalFunctions.checkPermission(adminData, Constant.DATABASE.PERMISSION.TYPE.PRE_QUALIFICATION);
                const data= await NotificationController.getNotification(payload);
				return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.DEFAULT, data));
			} catch (error) {
				UniversalFunctions.consolelog('error', error, true);
				return (UniversalFunctions.sendError(error));
			}
		},
		options: {
			description: 'get notification on admin end',
			tags: ['api', 'anonymous', 'admin', 'notification'],
			auth: 'AdminAuth',
			validate: {
				query: {
					limit: Joi.number(),
					page: Joi.number(),
					// sortType: Joi.number().valid([Constant.ENUM.SORT_TYPE]),
					// sortBy: Joi.string().default('date'),
					// fromDate: Joi.number(),
					// toDate: Joi.number(),
					// status: Joi.string(),
					// partnerId: Joi.string(),
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
	 * @description notification update
	 */
	 {
		method: 'PATCH',
		path: '/v1/admin/notification/{Id}',
		handler: async (request, h: ResponseToolkit) => {
			try {
				const adminData = request.auth && request.auth.credentials && (request.auth.credentials as any).adminData;
				const payload = {
					...request.params as any,
					...request.payload as any,
				};

				 const data = await NotificationController.updateNotification(payload)
				return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.DEFAULT, data));
			} catch (error) {
				UniversalFunctions.consolelog(error, 'error', true);
				return (UniversalFunctions.sendError(error));
			}
		},
		options: {
			description: 'update Notification marked as read',
			tags: ['api', 'anonymous', 'update', 'notification'],
			auth: 'AdminAuth',
			validate: {
				params: {
					Id: Joi.string(),
				},
				payload: {
					isread:Joi.boolean(),
					// createdAt: Joi.number(),
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
	 * @description: count of unread notification
	 *
	 */
	//  {
	// 	method: 'GET',
	// 	path: '/v1/admin/notification/count',
	// 	handler: async (request, h) => {
	// 		try {
    //             const adminData = request.auth && request.auth.credentials && (request.auth.credentials as any).adminData;
				
	// 		    //  const permission = await UniversalFunctions.checkPermission(adminData, Constant.DATABASE.PERMISSION.TYPE.PRE_QUALIFICATION);
    //             const data= await NotificationController.countNotification();
	// 			return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.DEFAULT, data));
	// 		} catch (error) {
	// 			UniversalFunctions.consolelog('error', error, true);
	// 			return (UniversalFunctions.sendError(error));
	// 		}
	// 	},
	// 	options: {
	// 		description: 'get count of unread notification',
	// 		tags: ['api', 'anonymous', 'admin', 'notification'],
	// 		auth: 'AdminAuth',
	// 		validate: {
	// 			headers: UniversalFunctions.authorizationHeaderObj,
	// 			failAction: UniversalFunctions.failActionFunction,
	// 		},
	// 		plugins: {
	// 			'hapi-swagger': {
	// 				responseMessages: Constant.swaggerDefaultResponseMessages,
	// 			},
	// 		},
	// 	},
	// },

]