import { ServerRoute } from 'hapi';
import * as Joi from 'joi';
import * as Constant from '@src/constants';
import * as UniversalFunctions from '@src/utils';
import { SavedPropertyServices } from '@src/controllers/property/savedProperty.controller';
import { SavePropertyRequest } from '@src/interfaces/saveProperty.interface';
export let savedProperty: ServerRoute[] = [
	/**
	 * @description: user Saved Property
	 */
    {
        method: 'POST',
        path: '/v1/user/save-property',
        handler: async (request, reply) => {
            try {
                const userData = request.auth && request.auth.credentials && (request.auth.credentials as any).userData;
                const payload: SavePropertyRequest.SaveProperty = request.payload as object;
                const data = await SavedPropertyServices.saveProperty(payload, userData);
                return UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.DEFAULT, data);
            } catch (error) {
                console.log('error', error);
                return UniversalFunctions.sendError(error);
            }
        },
        options: {
            description: 'user Liked Property saved',
            notes: 'user Liked Property saved',
            tags: ['api', 'users'],
            auth: 'UserAuth',
            validate: {
                payload: {
                    propertyId: Joi.string(),
                },
                failAction: UniversalFunctions.failActionFunction,
                headers: UniversalFunctions.authorizationHeaderObj,

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
        path: '/v1/user/save-property',
        handler: async (request, reply) => {
            try {
                const userData = request.auth && request.auth.credentials && (request.auth.credentials as any).userData;
                const payload: SavePropertyRequest.SavePropertyList = request.query;
                const data = await SavedPropertyServices.savePropertyList(payload, userData);
                return UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.DEFAULT, data);
            } catch (error) {
                console.log('error', error);
                return UniversalFunctions.sendError(error);
            }
        },
        options: {
            description: 'get saved Property of user',
            notes: 'saved property of user',
            tags: ['api', 'users', 'save-property'],
            auth: 'UserAuth',
            validate: {
                query: {
                    page: Joi.number(),
                    limit: Joi.number(),
                    sortBy: Joi.string().valid(['price', 'date', 'isFeatured']),
                    sortType: Joi.number().valid(Constant.ENUM.SORT_TYPE),
                },
                failAction: UniversalFunctions.failActionFunction,
                headers: UniversalFunctions.authorizationHeaderObj,
            },
            plugins: {
                'hapi-swagger': {
                    responseMessages: Constant.swaggerDefaultResponseMessages,
                },
            },
        },
    },

];