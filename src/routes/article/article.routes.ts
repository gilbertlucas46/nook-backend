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
                    // viewCount: Joi.number(),
                    imageUrl: Joi.string().required(),
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
    /**
     * related Article
     */
    {
        method: 'GET',
        path: '/v1/articles',
        handler: async (request, h) => {
            try {
                // const userData = request.auth && request.auth.credentials && request.auth.credentials.userData;
                const payload: ArticleRequest.GetArticle = request.query;
                const registerResponse = await ArticleService.getArticle(payload);
                return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.DEFAULT, registerResponse));
            } catch (error) {
                UniversalFunctions.consolelog('error', error, true);
                return (UniversalFunctions.sendError(error));
            }
        },
        options: {
            description: 'get articles for user application',
            tags: ['api', 'anonymous', 'user', 'user', 'Article'],
            // auth: 'UserAuth',
            validate: {
                query: {
                    limit: Joi.number(),
                    page: Joi.number(),
                    sortType: Joi.number().valid([Constant.ENUM.SORT_TYPE]),
                    sortBy: Joi.string(),
                    categoryId: Joi.number().valid([
                        Constant.DATABASE.ARTICLE_TYPE.AGENTS.NUMBER,
                        Constant.DATABASE.ARTICLE_TYPE.BUYING.NUMBER,
                        Constant.DATABASE.ARTICLE_TYPE.FEATURED_ARTICLE.NUMBER,
                        Constant.DATABASE.ARTICLE_TYPE.HOME_LOANS.NUMBER,
                        Constant.DATABASE.ARTICLE_TYPE.RENTING.NUMBER,
                        Constant.DATABASE.ARTICLE_TYPE.SELLING.NUMBER,
                    ]),
                    articleId: Joi.string(),
                },
                // headers: UniversalFunctions.authorizationHeaderObj,
                failAction: UniversalFunctions.failActionFunction,
            },
            plugins: {
                'hapi-swagger': {
                    responseMessages: Constant.swaggerDefaultResponseMessages,
                },
            },
        },
    },

    /** */
    {
        method: 'GET',
        path: '/v1/articles/{articleId}',
        handler: async (request, h) => {
            try {
                // const userData = request.auth && request.auth.credentials && request.auth.credentials.userData;
                const payload: ArticleRequest.GetArticleById = request.params;
                const registerResponse = await ArticleService.getArticleById(payload);
                return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.DEFAULT, registerResponse));
            } catch (error) {
                UniversalFunctions.consolelog('error', error, true);
                return (UniversalFunctions.sendError(error));
            }
        },
        options: {
            description: 'get articles for user application',
            tags: ['api', 'anonymous', 'user', 'user', 'Article'],
            // auth: 'UserAuth',
            validate: {
                params: {
                    articleId: Joi.string(),
                },
                // headers: UniversalFunctions.authorizationHeaderObj,
                failAction: UniversalFunctions.failActionFunction,
            },
            plugins: {
                'hapi-swagger': {
                    responseMessages: Constant.swaggerDefaultResponseMessages,
                },
            },
        },
    },

    /**
     * SHOW FULL ARTICLES
     */
    // {
    //     method: 'GET',
    //     path: '/v1/show-all-articles',
    //     handler: async (request, h) => {
    //         try {
    //             // const userData = request.auth && request.auth.credentials && request.auth.credentials.userData;
    //             // const payload: ArticleRequest.GetArticle = request.query;
    //             const registerResponse = await ArticleService.getAllArticle();
    //             return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S201.ARTICLE_CREATED, registerResponse));
    //         } catch (error) {
    //             UniversalFunctions.consolelog('error', error, true);
    //             return (UniversalFunctions.sendError(error));
    //         }
    //     },
    //     options: {
    //         description: 'get articles for user application',
    //         tags: ['api', 'anonymous', 'user', 'user', 'Article'],
    //         // auth: 'UserAuth',
    //         validate: {
    //             query: {
    //                 // headers: UniversalFunctions.authorizationHeaderObj,
    //                 failAction: UniversalFunctions.failActionFunction,
    //             },
    //             plugins: {
    //                 'hapi-swagger': {
    //                     responseMessages: Constant.swaggerDefaultResponseMessages,
    //                 },
    //             },
    //         },
    //     },
    // },
    {
        method: 'PUT',
        path: '/v1/admin/articles/{articleId}',
        handler: async (request, h) => {
            try {
                const adminData = request.auth && request.auth.credentials && request.auth.credentials.adminData;
                const payload = {
                    ...request.payload,
                    ...request.params,
                };
                console.log('payloadpayloadpayloadv', payload);

                const registerResponse = await ArticleService.updateArticle(payload, adminData);
                return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200, registerResponse));
            } catch (error) {
                UniversalFunctions.consolelog('error', error, true);
                return (UniversalFunctions.sendError(error));
            }
        },
        options: {
            description: 'get articles for user application',
            tags: ['api', 'anonymous', 'user', 'user', 'Article'],
            auth: 'AdminAuth',
            validate: {
                payload: {
                    title: Joi.string(),
                    description: Joi.string().required(),
                    imageUrl: Joi.string().required(),
                    categoryId: Joi.number().valid([
                        Constant.DATABASE.ARTICLE_TYPE.AGENTS.NUMBER,
                        Constant.DATABASE.ARTICLE_TYPE.BUYING.NUMBER,
                        Constant.DATABASE.ARTICLE_TYPE.FEATURED_ARTICLE.NUMBER,
                        Constant.DATABASE.ARTICLE_TYPE.HOME_LOANS.NUMBER,
                        Constant.DATABASE.ARTICLE_TYPE.RENTING.NUMBER,
                        Constant.DATABASE.ARTICLE_TYPE.SELLING.NUMBER,
                    ]),
                    articleId: Joi.string(),
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
        path: '/v1/admin/articles',
        handler: async (request, h) => {
            try {
                // const userData = request.auth && request.auth.credentials && request.auth.credentials.userData;
                const payload: ArticleRequest.GetArticle = request.query;
                const registerResponse = await ArticleService.getArticle(payload);
                return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.DEFAULT, registerResponse));
            } catch (error) {
                UniversalFunctions.consolelog('error', error, true);
                return (UniversalFunctions.sendError(error));
            }
        },
        options: {
            description: 'get articles for user application',
            tags: ['api', 'anonymous', 'user', 'user', 'Article'],
            auth: 'AdminAuth',
            validate: {
                query: {
                    limit: Joi.number(),
                    page: Joi.number(),
                    sortType: Joi.number().valid([Constant.ENUM.SORT_TYPE]),
                    sortBy: Joi.string(),
                    categoryId: Joi.number().valid([
                        Constant.DATABASE.ARTICLE_TYPE.AGENTS.NUMBER,
                        Constant.DATABASE.ARTICLE_TYPE.BUYING.NUMBER,
                        Constant.DATABASE.ARTICLE_TYPE.FEATURED_ARTICLE.NUMBER,
                        Constant.DATABASE.ARTICLE_TYPE.HOME_LOANS.NUMBER,
                        Constant.DATABASE.ARTICLE_TYPE.RENTING.NUMBER,
                        Constant.DATABASE.ARTICLE_TYPE.SELLING.NUMBER,
                    ]),
                    // articleId: Joi.string(),
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
        path: '/v1/admin/articles/{articleId}',
        handler: async (request, h) => {
            try {
                // const userData = request.auth && request.auth.credentials && request.auth.credentials.userData;
                const payload: ArticleRequest.GetArticleById = request.params;
                const registerResponse = await ArticleService.getArticleById(payload);
                return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.DEFAULT, registerResponse));
            } catch (error) {
                UniversalFunctions.consolelog('error', error, true);
                return (UniversalFunctions.sendError(error));
            }
        },
        options: {
            description: 'get articles for user application',
            tags: ['api', 'anonymous', 'user', 'user', 'Article'],
            auth: 'AdminAuth',
            validate: {
                params: {
                    articleId: Joi.string(),
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
        method: 'DELETE',
        path: '/v1/articles/{articleId}',
        handler: async (request, h) => {
            try {
                // const userData = request.auth && request.auth.credentials && request.auth.credentials.userData;
                const payload: ArticleRequest.DeleteArticle = request.params;
                const registerResponse = await ArticleService.deleteArticle(payload);
                return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.DEFAULT, registerResponse));
            } catch (error) {
                UniversalFunctions.consolelog('error', error, true);
                return (UniversalFunctions.sendError(error));
            }
        },
        options: {
            description: 'delete articles by admin',
            tags: ['api', 'anonymous', 'admin', 'Article'],
            auth: 'AdminAuth',
            validate: {
                params: {
                    articleId: Joi.string(),
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