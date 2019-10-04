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
            //  auth: 'UserAuth',
            validate: {
                query: {
                    page: Joi.number(),
                    limit: Joi.number(),
                    searchTerm: Joi.string(),
                    type: Joi.string(),
                    label: Joi.array(),
                    propertyType: Joi.number(),
                    sortBy: Joi.number().valid([]),
                    sortType: Joi.number().valid(Constant.ENUM.SORT_TYPE),
                    fromDate: Joi.number(),
                    toDate: Joi.number(),
                    cityId: Joi.string(),
                    // agentSpecialisation: Joi.boolean().default('false'),
                    agentSpecialisation: Joi.number(),
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