import * as Joi from 'joi';
import { ServerRoute, ResponseToolkit } from 'hapi';

import * as UniversalFunctions from '@src/utils';
import * as Constant from '@src/constants/app.constant';
import { transactionController } from '@src/controllers';

export let transactionRoute: ServerRoute[] = [
	// for the charge  // check the minimum transaction history
	{
		method: 'POST',
		path: '/v1/transaction/charge',
		handler: async (request, h: ResponseToolkit) => {
			try {
				const userData = request.auth && request.auth.credentials && (request.auth.credentials as any).userData;
				const payload: any = request.payload;
				const data = await transactionController.createCharge(payload, userData);
				return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S201.PAYMENT_ADDED, {}));
			} catch (error) {
				return (UniversalFunctions.sendError(error));
			}
		},
		options: {
			description: 'create charge of the user',
			tags: ['api', 'anonymous', 'stripe', 'Add'],
			auth: 'UserAuth',
			validate: {
				payload: {
					amount: Joi.number().min(40),
					currency: Joi.string().valid('php'),
					source: Joi.string().default('tok_visa'),
					featuredType: Joi.string().valid([
						Constant.DATABASE.FEATURED_TYPE.PROFILE,
						Constant.DATABASE.FEATURED_TYPE.PROPERTY,
						Constant.DATABASE.FEATURED_TYPE.HOMEPAGE,
					]).required(),
					description: Joi.string().max(35).default(''),
					billingType: Joi.string().valid([
						Constant.DATABASE.BILLING_TYPE.MONTHLY,
						Constant.DATABASE.BILLING_TYPE.YEARLY,
					]).required(),
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
		path: '/v1/transaction',
		handler: async (request, h: ResponseToolkit) => {
			try {
				const userData = request.auth && request.auth.credentials && (request.auth.credentials as any).userData;
				const query: any = request.query;
				const data = await transactionController.invoiceList(query, userData);
				return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.DEFAULT, data));
			} catch (error) {
				return (UniversalFunctions.sendError(error));
			}
		},
		options: {
			description: 'invoice list',
			tags: ['api', 'transaction'],
			auth: 'UserAuth',
			validate: {
				query: {
					page: Joi.number().required(),
					limit: Joi.number().required(),
					featuredType: Joi.string().valid([
						Constant.DATABASE.FEATURED_TYPE.PROFILE,
						Constant.DATABASE.FEATURED_TYPE.PROPERTY,
						Constant.DATABASE.FEATURED_TYPE.HOMEPAGE,
					]).optional(),
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
		method: 'POST',
		path: '/v1/transaction/webhook',
		handler: async (request, h: ResponseToolkit) => {
			const payload = request.payload;
			try {
				const data = await transactionController.webhook(payload);
				return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.DEFAULT, data));
			} catch (error) {
				return (UniversalFunctions.sendError(error));
			}
		},
		options: {
			description: 'Webhook for stripe',
			tags: ['api', 'transaction'],
		},
	},
];