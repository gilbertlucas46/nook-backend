import * as Joi from 'joi';

import { ServerRoute, ResponseToolkit } from 'hapi';
import * as UniversalFunctions from '@src/utils';
import * as Constant from '@src/constants/app.constant';
import { subscriptionController } from '@src/controllers';

export let subscriptionRoute: ServerRoute[] = [
	{
		method: 'GET',
		path: '/v1/subscription',
		handler: async (request, h: ResponseToolkit) => {
			try {
				const query = request.query;
				const data = await subscriptionController.subscriptionList(query);
				return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.DEFAULT, data));
			} catch (error) {
				return (UniversalFunctions.sendError(error));
			}
		},
		options: {
			description: 'subscription cost list',
			tags: ['api', 'subscription'],
			auth: 'DoubleAuth',
			validate: {
				query: {
					type: Joi.string().valid([
						Constant.DATABASE.BILLING_TYPE.MONTHLY,
						Constant.DATABASE.BILLING_TYPE.YEARLY
					]).required()
				},
				headers: UniversalFunctions.authorizationHeaderObj,
				failAction: UniversalFunctions.failActionFunction
			},
			plugins: {
				'hapi-swagger': {
					responseMessages: Constant.swaggerDefaultResponseMessages
				}
			}
		}
	}
];