import { ServerRoute, ResponseToolkit } from 'hapi';
import * as Joi from 'joi';
import * as UniversalFunctions from '@src/utils';
import * as Constant from '@src/constants/app.constant';
import { stripeController } from '@src/controllers';

export let paymentRoute: ServerRoute[] = [
    {
        method: 'POST',
        path: '/v1/cardDetail',
        handler: async (request, h: ResponseToolkit) => {
            try {
                // const userData = request.auth && request.auth.credentials && (request.auth.credentials as any).userData;
                const payload: any = request.payload;
                await stripeController.addPayment(payload);
                return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S201.CREATED, {}));
            } catch (error) {
                return (UniversalFunctions.sendError(error));
            }
        },
        options: {
            description: 'add payment stripe',
            tags: ['api', 'anonymous', 'stripe', 'Add'],
            // auth: 'UserAuth',
            validate: {
                payload: {
                    tokenData: Joi.string(),
                    cardtokenDetail: Joi.string(),
                },
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