import { ServerRoute, Request } from 'hapi';
import * as Joi from 'joi';
import * as UniversalFunctions from '@src/utils';
import * as Constant from '@src/constants/app.constant';
import { searchController } from '@src/controllers';
export let searchRoutes: ServerRoute[] = [
	/**
	 * @description: register user based on unique mail and userName
	 */
    {
        method: 'POST',
        path: '/v1/user/search',
        async handler(request, h) {
            try {
                const userData = request.auth && request.auth.credentials && request.auth.credentials['userData'];
                // const payload: UserRequest.UpdateAccount = request.payload as any;

                const payload: any = request.query;
                const registerResponse = await searchController.search(payload, userData);
                return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S201.CREATED, registerResponse));
            } catch (error) {
                return (UniversalFunctions.sendError(error));
            }
        },
        options: {
            description: 'Register to applications',
            tags: ['api', 'anonymous', 'user', 'register'],
            auth: 'UserAuth',
            validate: {
                query: {
                    text: Joi.string(),
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
