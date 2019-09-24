'use strict';
import * as Joi from 'joi';
import * as UniversalFunctions from '@src/utils';
import * as Constant from '@src/constants/app.constant';
import { ArticleService } from '@src/controllers';
import { ArticleRequest } from '@src/interfaces/article.interface';

export let articleRoutes = [
    {
        method: 'POST',
        path: '/v1/admin/article',
        handler: async (request, h) => {
            try {
                const adminData = request.auth && request.auth.credentials && request.auth.credentials.adminData;
                const payload: ArticleRequest.CreateArticle = request.payload;
                const registerResponse = await ArticleService.createArticle(payload, adminData);
                return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S201.ARTICLE_CREATED, {}));
            } catch (error) {
                UniversalFunctions.consolelog('error', error, true);
                return (UniversalFunctions.sendError(error));
            }
        },
        options: {
            description: 'create article application',
            tags: ['api', 'anonymous', 'user', 'admin', 'staff', 'Article'],
            auth: 'AdminAuth',
            validate: {
                payload: {
                    title: Joi.string(),
                    description: Joi.string().required(),
                    viewCount: Joi.number(),
                    // shareCount: Joi.number(),
                    categoryId: Joi.number().valid([
                        Constant.DATABASE.ARTICLE_TYPE.AGENTS.NUMBER,
                        Constant.DATABASE.ARTICLE_TYPE.BUYING.NUMBER,
                        Constant.DATABASE.ARTICLE_TYPE.FEATURED_ARTICLE.NUMBER,
                        Constant.DATABASE.ARTICLE_TYPE.HOME_LOANS.NUMBER,
                        Constant.DATABASE.ARTICLE_TYPE.RENTING.NUMBER,
                        Constant.DATABASE.ARTICLE_TYPE.SELLING.NUMBER,
                    ]),
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