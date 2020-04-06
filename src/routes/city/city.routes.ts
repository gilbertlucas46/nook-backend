'use strict';
import { ServerRoute, Request, ResponseToolkit } from 'hapi';
import * as Joi from 'joi';
import * as UniversalFunctions from '@src/utils';
import * as Constant from '@src/constants/app.constant';
import { CityService } from '@src/controllers';

export let cityRoutes: ServerRoute[] = [
    {
        method: 'GET',
        path: '/v1/cities/featured',
        handler: async (req: Request, h: ResponseToolkit) => {
            try {
                const data_to_send = await CityService.featuredCities();
                return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.DEFAULT, data_to_send));
            } catch (error) {
                return (UniversalFunctions.sendError(error));
            }
        },
        options: {
            description: 'Get featured cities list',
            tags: ['api', 'anonymous', 'user', 'Cities'],
            auth: 'DoubleAuth',
            validate: {
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