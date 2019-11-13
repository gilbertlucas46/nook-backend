import { ServerRoute, ResponseToolkit } from 'hapi';
import * as Joi from 'joi';
import * as UniversalFunctions from '@src/utils';
import * as Constant from '@src/constants/app.constant';
import { stripeController } from '@src/controllers';

export let paymentRoute: ServerRoute[] = [
    {
        method: 'POST',
        path: '/v1/checkCusotmerId',
        handler: async (request, h: ResponseToolkit) => {
            try {
                const userData = request.auth && request.auth.credentials && (request.auth.credentials as any).userData;
                const payload = request.payload;
                const data = await stripeController.checkCustomer(payload, userData);
                return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.DEFAULT, data));
            } catch (error) {
                return (UniversalFunctions.sendError(error));
            }
        },
        options: {
            description: 'add customer to the stripe',
            tags: ['api', 'anonymous', 'stripe', 'Add'],
            auth: 'UserAuth',
            validate: {
                payload: {
                    // userId: Joi.string(),
                    // userName: Joi.string(),

                    // source: Joi.string(),

                    // tokenData: Joi.string(),
                    // cardtokenDetail: Joi.string(),
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
     */
    {
        method: 'POST',
        path: '/v1/card-token',
        handler: async (request, h: ResponseToolkit) => {
            try {
                const userData = request.auth && request.auth.credentials && (request.auth.credentials as any).userData;
                const payload: any = request.payload;
                const data = await stripeController.addCustomerCard(payload, userData);
                return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.DEFAULT, data));
            } catch (error) {
                return (UniversalFunctions.sendError(error));
            }
        },
        options: {
            description: 'add customer to the stripe',
            tags: ['api', 'anonymous', 'stripe', 'Add'],
            auth: 'UserAuth',
            validate: {
                payload: {
                    // userId: Joi.string(),
                    // userName: Joi.string(),
                    // source: Joi.string(),        // stripe customer
                    cardToken: Joi.string(),
                    // tokenData: Joi.string(),
                    // cardtokenDetail: Joi.string(),
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
        path: '/v1/card-token',
        handler: async (request, h: ResponseToolkit) => {
            try {
                const userData = request.auth && request.auth.credentials && (request.auth.credentials as any).userData;
                const payload: any = request.payload;
                await stripeController.deleteCard(payload, userData);
                return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S201.CREATED, {}));
            } catch (error) {
                return (UniversalFunctions.sendError(error));
            }
        },
        options: {
            description: 'add payment stripe',
            tags: ['api', 'anonymous', 'stripe', 'Add'],
            auth: 'UserAuth',
            validate: {
                payload: {
                    cardToken: Joi.string(),
                    // cardtokenDetail: Joi.string(),
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

    // for the charge  // check the minimum transaction history
    {
        method: 'POST',
        path: '/v1/charge',
        handler: async (request, h: ResponseToolkit) => {
            try {
                const userData = request.auth && request.auth.credentials && (request.auth.credentials as any).userData;
                const payload: any = request.payload;
                const data = await stripeController.createCharge(payload, userData);
                return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.DEFAULT, data));
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
                    amount: Joi.number(),
                    currency: Joi.string().valid('php'),
                    source: Joi.string(),
                    description: Joi.string().max(50),
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

    // transaction

    {
        method: 'POST',
        path: '/v1/transaction',
        handler: async (request, h: ResponseToolkit) => {
            try {
                const userData = request.auth && request.auth.credentials && (request.auth.credentials as any).userData;
                const payload: any = request.payload;
                const data = await stripeController.createCharge(payload, userData);
                return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.DEFAULT, data));
            } catch (error) {
                return (UniversalFunctions.sendError(error));
            }
        },
        options: {
            description: 'maintain the transactoin of the user',
            tags: ['api', 'anonymous', 'stripe', 'Add', 'transaction'],
            auth: 'UserAuth',
            validate: {
                payload: {
                    // amount: Joi.number(),
                    // currency: Joi.string().valid('php'),
                    // source: Joi.string(),
                    // description: Joi.string().max(50),
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