'use strict';
import * as Joi from 'joi';
import * as UniversalFunctions from '@src/utils';
import * as Constant from '@src/constants/app.constant';
import { ArticleService } from '@src/controllers';
import { ArticleRequest } from '@src/interfaces/article.interface';

export let articleRoutes = [
    {
        method: 'POST',
        path: '/v1/article',
        handler: async (request, h) => {
            try {
                const userData = request.auth && request.auth.credentials && request.auth.credentials.userData;
                const payload: ArticleRequest.CreateArticle = request.payload;
                const registerResponse = await ArticleService.createArticle(payload, userData);
                return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S201.ENQUIRY_SUBMITTED, registerResponse));
            } catch (error) {
                UniversalFunctions.consolelog('error', error, true);
                return (UniversalFunctions.sendError(error));
            }
        },
        options: {
            description: 'create article application',
            tags: ['api', 'anonymous', 'admin', 'staff', 'Article'],
            auth: 'AdminAuth',
            validate: {
                payload: {
                    category: Joi.string().required(),
                    description: Joi.string().required(),
                    viewCount: Joi.string().required(),
                    shareCount: Joi.string().required(),
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