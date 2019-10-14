import { ServerRoute, Request, ResponseToolkit } from 'hapi';
import * as Joi from 'joi';
import * as UniversalFunctions from '@src/utils';
import * as Constant from '@src/constants/app.constant';
import { AgentService } from '@src/controllers';
import { AgentRequest } from '@src/interfaces/agent.interface';

export let agentRoute: ServerRoute[] = [
    {
        method: 'GET',
        path: '/v1/agents',
        handler: async (request, h: ResponseToolkit) => {
            try {
                const reqObj: AgentRequest.SearchAgent = request.query;
                const agentList = await AgentService.searchAgent(reqObj);
                return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.DEFAULT, agentList));
            } catch (error) {
                return (UniversalFunctions.sendError(error));
            }
        },
        options: {
            description: 'GET agents',
            tags: ['api', 'anonymous', 'agent'],
            auth: 'DoubleAuth',
            validate: {
                query: {
                    page: Joi.number(),
                    limit: Joi.number(),
                    searchTerm: Joi.string(),
                    type: Joi.string(),
                    label: Joi.array(),
                    propertyType: Joi.number(),
                    sortBy: Joi.number().valid(['date']),
                    sortType: Joi.number().valid(Constant.ENUM.SORT_TYPE),
                    fromDate: Joi.number(),
                    toDate: Joi.number(),
                    cityId: Joi.string(),
                    userId: Joi.string(),
                    specializingIn_property_type: Joi.number().valid([
                        Constant.DATABASE.PROPERTY_FOR.RENT.NUMBER,
                        Constant.DATABASE.PROPERTY_FOR.SALE.NUMBER,
                    ]),
                    soldProperty: Joi.number().valid(
                        Constant.DATABASE.PROPERTY_STATUS.SOLD_RENTED.NUMBER ,
                    ),
                    specializingIn_property_category: Joi.array()
                        .items(
                            Joi.string().trim().valid(
                                Constant.DATABASE.PROPERTY_TYPE['APPARTMENT/CONDO'],
                                Constant.DATABASE.PROPERTY_TYPE.COMMERCIAL,
                                Constant.DATABASE.PROPERTY_TYPE.HOUSE_LOT,
                                Constant.DATABASE.PROPERTY_TYPE.LAND,
                                Constant.DATABASE.PROPERTY_TYPE.ROOM,
                                '',
                            ),
                        ),
                    searchBy: Joi.string().valid('company', 'name', 'location').default('location'),
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
        path: '/v1/agents/{userName}',
        handler: async (request, h: ResponseToolkit) => {
            try {
                const userName = request.params.userName;
                const agentData = await AgentService.agentInfo(userName);
                return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.DEFAULT, agentData[0]));
            } catch (error) {
                return (UniversalFunctions.sendError(error));
            }
        },
        options: {
            description: 'GET agents',
            tags: ['api', 'anonymous', 'agent'],
            auth: 'UserAuth',
            validate: {
                params: {
                    userName: Joi.string(),
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