import * as Joi from 'joi';
import * as UniversalFunctions from '@src/utils';
import * as Constant from '@src/constants/app.constant';
import { ServerRoute } from 'hapi';
import { NotificationController } from '@src/controllers/notification/notification.controller';

export let notificationRoute: ServerRoute[]=[
    /**
	 * @description: user loan for user loan-section
	 *
	 */
	{
		method: 'GET',
		path: '/v1/admin/notification',
		handler: async (request, h) => {
			try {
                const adminData = request.auth && request.auth.credentials && (request.auth.credentials as any).adminData;
				const payload = {
					...request.payload as any,
					...request.params as any,
				};
			    const permission = await UniversalFunctions.checkPermission(adminData, Constant.DATABASE.PERMISSION.TYPE.PRE_QUALIFICATION);

				//const data = await LoanController.notificationlist(payload, userData);
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
]