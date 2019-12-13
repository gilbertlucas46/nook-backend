'use strict';
import { ServerRoute, Request, ResponseToolkit } from 'hapi';
import * as Joi from 'joi';
import * as UniversalFunctions from '@src/utils';
import * as Constant from '@src/constants/app.constant';
import { CityService } from '@src/controllers';
import { PropertyRequest } from '@src/interfaces/property.interface';

export let cityRoutes: ServerRoute[] = [
    {
        method: 'GET',
        path: '/v1/cities/popular',
        handler: async (req: Request, h: ResponseToolkit) => {
            try {
                const payload: PropertyRequest.PopularCity = req.query as any;
                const data_to_send = await CityService.popularCities(payload);
                return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.DEFAULT, data_to_send));
            } catch (error) {
                return (UniversalFunctions.sendError(error));
            }
        },
        options: {
            description: 'Get most popular cities list',
            tags: ['api', 'anonymous', 'user', 'Cities'],
            auth: 'DoubleAuth',
            validate: {
                query: {
                    propertyType: Joi.number().required(),
                    limit: Joi.number(),
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

    {
        method: 'GET',
        path: '/v1/cities/featured/{cityId}',
        handler: async (req: Request, h: ResponseToolkit) => {
            try {
                const payload = req.params;
                const data_to_get = await CityService.cityData(payload);
                return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.DEFAULT, data_to_get));
            } catch (error) {
                return (UniversalFunctions.sendError(error));
            }
        },
        options: {
            description: 'Get featured cities data',
            tags: ['api', 'anonymous', 'user', 'Cities', 'data'],
            auth: 'DoubleAuth',
            validate: {
                params: {
                    cityId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
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