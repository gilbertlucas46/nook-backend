'use strict';
import { ServerRoute, Request, ResponseToolkit } from 'hapi';
import * as Joi from 'joi';
import * as UniversalFunctions from '@src/utils';
import * as Constant from '@src/constants/app.constant';
import { CityService } from '@src/controllers';

export let cityRoutes: ServerRoute[] = [
    {
        method: 'GET',
        path: '/v1/popular/cities',
        handler: async (req: Request, h: ResponseToolkit) => {
            try {
                const data_to_send = await CityService.popularCities(req.query);
                return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.DEFAULT, data_to_send));
            } catch (error) {
                return (UniversalFunctions.sendError(error));
            }
        },
        options: {
            description: 'Get most popular cities list',
            tags: ['api', 'anonymous', 'user', 'Cities'],
            // auth: 'UserAuth',
            validate: {
                query: {
                    query: {
                        page: Joi.number(),
                        limit: Joi.number(),
                    },
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
