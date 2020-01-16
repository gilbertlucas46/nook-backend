'use strict';
import * as Joi from 'joi';
import { ServerRoute } from 'hapi';
import * as UniversalFunctions from '@src/utils';
import * as Constant from '@src/constants/app.constant';
import { ArticleService, CategoryService } from '@src/controllers';
import * as ENTITY from '../../entity';
import { ArticleRequest } from '@src/interfaces/article.interface';

export let articleRoutes: ServerRoute[] = [
    /**
     * @description:admin add the article name
     */
    {
        method: 'POST',
        path: '/v1/admin/categories',
        handler: async (request, h) => {
            try {
                const adminData = request.auth && request.auth.credentials && (request.auth.credentials as any).adminData;
                const payload = request.payload as ArticleRequest.AddCategoriesName;
                // if (adminData.type === Constant.DATABASE.USER_TYPE.STAFF.TYPE) {
                //     await ENTITY.AdminStaffEntity.checkPermission(Constant.DATABASE.PERMISSION.TYPE.ARTICLE);
                // }
                const data = await ArticleService.addArticleName(payload, adminData);
                return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S201.CATEGORY_CREATED, data));
            } catch (error) {
                UniversalFunctions.consolelog('error', error, true);
                return (UniversalFunctions.sendError(error));
            }
        },
        options: {
            description: 'create article categories',
            tags: ['api', 'anonymous', 'user', 'admin', 'articleName', 'add'],
            auth: 'AdminAuth',
            validate: {
                payload: {
                    name: Joi.string().uppercase(),
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
     * @description category list in admin
     */
    {
        method: 'GET',
        path: '/v1/admin/categories',
        handler: async (request, h) => {
            try {
                const adminData = request.auth && request.auth.credentials && (request.auth.credentials as any).adminData;
                const payload: ArticleRequest.CategoryList = request.query as any;
                // if (adminData.type === Constant.DATABASE.USER_TYPE.STAFF.TYPE) {
                //     await ENTITY.AdminStaffEntity.checkPermission(Constant.DATABASE.PERMISSION.TYPE.ARTICLE);
                // }
                const data = await ArticleService.getCategoryList(payload);
                return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.DEFAULT, data));
            } catch (error) {
                UniversalFunctions.consolelog('error', error, true);
                return (UniversalFunctions.sendError(error));
            }
        },
        options: {
            description: 'get article categories',
            tags: ['api', 'anonymous', 'user', 'admin', 'category', 'list'],
            auth: 'AdminAuth',
            validate: {
                query: {
                    limit: Joi.number(),
                    page: Joi.number(),
                    sortType: Joi.number().valid([Constant.ENUM.SORT_TYPE]),
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
     * @description admin update article Category
     */
    {
        method: 'PATCH',
        path: '/v1/admin/categories/{id}',
        handler: async (request, h) => {
            try {
                const adminData = request.auth && request.auth.credentials && (request.auth.credentials as any).adminData;
                const payload: ArticleRequest.CategoryUpdate = {
                    ...request.params as any,
                    ...request.payload as ArticleRequest.CategoryUpdate,
                };
                const checkPermission = adminData['permission'].some(data => {
                    return data.moduleName === Constant.DATABASE.PERMISSION.TYPE.Article_Category;
                });
                if (checkPermission === false) {
                    return UniversalFunctions.sendError(Constant.STATUS_MSG.ERROR.E404);
                }
                const data = await ArticleService.updateCategoryList(payload);
                return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.DEFAULT, data));
            } catch (error) {
                UniversalFunctions.consolelog('error', error, true);
                return (UniversalFunctions.sendError(error));
            }
        },
        options: {
            description: 'update article categories',
            tags: ['api', 'anonymous', 'admin', 'category', 'update'],
            auth: 'AdminAuth',
            validate: {
                query: {
                    id: Joi.string().regex(/^[0-9a-fA5-F]{24}$/).required(),
                },
                payload: {
                    name: Joi.string(),
                    status: Joi.string().valid([
                        Constant.DATABASE.ArticleCategoryStatus.ACTIVE,
                        Constant.DATABASE.ArticleCategoryStatus.BLOCK,
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
     * @description delete categories
     */
    {
        method: 'DELETE',
        path: '/v1/admin/categories/{id}',
        handler: async (request, h) => {
            try {
                const adminData = request.auth && request.auth.credentials && (request.auth.credentials as any).adminData;
                const payload: ArticleRequest.CategoryId = request.params as ArticleRequest.CategoryId;
                // if (adminData.type === Constant.DATABASE.USER_TYPE.STAFF.TYPE) {
                //     await ENTITY.AdminStaffEntity.checkPermission(Constant.DATABASE.PERMISSION.TYPE.ARTICLE);
                // }
                const data = await CategoryService.deleteCategory(payload);
                return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.DELETED, {}));
            } catch (error) {
                UniversalFunctions.consolelog('error', error, true);
                return (UniversalFunctions.sendError(error));
            }
        },
        options: {
            description: 'delete article categories',
            tags: ['api', 'anonymous', 'user', 'admin', 'category', 'delete'],
            auth: 'AdminAuth',
            validate: {
                params: {
                    id: Joi.string(),
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
     * @description:admin add the article
     */
    {
        method: 'POST',
        path: '/v1/admin/article',
        handler: async (request, h) => {
            try {
                const adminData = request.auth && request.auth.credentials && (request.auth.credentials as any).adminData;
                const payload = request.payload as ArticleRequest.CreateArticle;
                // if (adminData.type === Constant.DATABASE.USER_TYPE.STAFF.TYPE) {
                //     await ENTITY.AdminStaffEntity.checkPermission(Constant.DATABASE.PERMISSION.TYPE.ARTICLE);
                // }
                const data = await ArticleService.createArticle(payload, adminData);
                return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S201.ARTICLE_CREATED, data));
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
                    shortDescription: Joi.string(),
                    // viewCount: Joi.number(),
                    imageUrl: Joi.string().required(),
                    // articleCategoryId: Joi.string(),
                    categoryId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),

                    isFeatured: Joi.boolean(),
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
     *
     */
    {
        method: 'GET',
        path: '/v1/articles',
        handler: async (request, h) => {
            try {
                // const userData = request.auth && request.auth.credentials && request.auth.credentials.userData;
                const payload: ArticleRequest.GetArticle = request.query as any;
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
            auth: 'DoubleAuth',
            validate: {
                query: {
                    limit: Joi.number(),
                    page: Joi.number(),
                    sortType: Joi.number().valid([Constant.ENUM.SORT_TYPE]),
                    sortBy: Joi.string(),
                    categoryId: Joi.string(),
                    articleId: Joi.string(),
                    // searchTerm: Joi.string(),
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

    /** */
    {
        method: 'GET',
        path: '/v1/articles/home',
        handler: async (request, h) => {
            try {
                const payload: ArticleRequest.GetArticle = request.query as any;
                const registerResponse = await ArticleService.getCategoryWiseArticles(payload);
                return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.DEFAULT, registerResponse));
            } catch (error) {
                UniversalFunctions.consolelog('error', error, true);
                return (UniversalFunctions.sendError(error));
            }
        },
        options: {
            description: 'get articles for user application',
            tags: ['api', 'anonymous', 'user', 'user', 'Article'],
            auth: 'DoubleAuth',
            validate: {
                query: {
                    limit: Joi.number(),
                    page: Joi.number(),
                    searchTerm: Joi.string(),
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

    /** */
    {
        method: 'GET',
        path: '/v1/articles/{articleId}',
        handler: async (request, h) => {
            try {
                const payload: ArticleRequest.GetArticleById = request.params as any;
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
            auth: 'DoubleAuth',
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
    /** */
    {
        method: 'PATCH',
        path: '/v1/admin/article/{articleId}',
        handler: async (request, h) => {
            try {
                const adminData = request.auth && request.auth.credentials && (request.auth.credentials as any).adminData;
                const payload = {
                    ...request.payload as ArticleRequest.UpdateArticle,
                    ...request.params,
                };

                // if (adminData.type === Constant.DATABASE.USER_TYPE.STAFF.TYPE) {
                //     await ENTITY.AdminStaffEntity.checkPermission(Constant.DATABASE.PERMISSION.TYPE.ARTICLE);
                // }
                const registerResponse = await ArticleService.updateArticle(payload, adminData);
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
                    articleId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
                },
                payload: {
                    title: Joi.string(),
                    description: Joi.string(),
                    imageUrl: Joi.string(),
                    status: Joi.string().valid([
                        Constant.DATABASE.ARTICLE_STATUS.ACTIVE,
                        Constant.DATABASE.ARTICLE_STATUS.BLOCK,
                    ]),
                    categoryId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
                    isFeatured: Joi.boolean().default(false),
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
        path: '/v1/admin/article',
        handler: async (request, h) => {
            try {
                const adminData = request.auth && request.auth.credentials && (request.auth.credentials as any).adminData;
                const payload: ArticleRequest.GetArticle = request.query as any;
                // if (adminData.type === Constant.DATABASE.USER_TYPE.STAFF.TYPE) {
                //     await ENTITY.AdminStaffEntity.checkPermission(Constant.DATABASE.PERMISSION.TYPE.ARTICLE);
                // }
                const registerResponse = await ArticleService.getArticle(payload, adminData);
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
                    articleId: Joi.string(),
                    // categoryId: Joi.number().valid([
                    //     Constant.DATABASE.ARTICLE_TYPE.AGENTS.NUMBER,
                    //     Constant.DATABASE.ARTICLE_TYPE.BUYING.NUMBER,
                    //     // Constant.DATABASE.ARTICLE_TYPE.FEATURED_ARTICLE.NUMBER,
                    //     Constant.DATABASE.ARTICLE_TYPE.HOME_LOANS.NUMBER,
                    //     Constant.DATABASE.ARTICLE_TYPE.RENTING.NUMBER,
                    //     Constant.DATABASE.ARTICLE_TYPE.SELLING.NUMBER,
                    //     Constant.DATABASE.ARTICLE_TYPE.NEWS.NUMBER,
                    //     // Constant.DATABASE.ARTICLE_TYPE.DOMESTIC_NEWS.NUMBER,
                    // ]),
                    status: Joi.string().valid([
                        Constant.DATABASE.ARTICLE_STATUS.ACTIVE,
                        Constant.DATABASE.ARTICLE_STATUS.BLOCK,
                        Constant.DATABASE.ARTICLE_STATUS.PENDING,
                    ]),
                    categoryId: Joi.string(),
                    isFeatured: Joi.boolean(),
                    fromDate: Joi.number(),
                    toDate: Joi.number(),
                    searchTerm: Joi.string(),
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
        path: '/v1/admin/article/{articleId}',
        handler: async (request, h) => {
            try {
                // const userData = request.auth && request.auth.credentials && request.auth.credentials.userData;
                const adminData = request.auth && request.auth.credentials && (request.auth.credentials as any).adminData;
                const payload: ArticleRequest.GetArticleById = request.params as any;
                // if (adminData.type === Constant.DATABASE.USER_TYPE.STAFF.TYPE) {
                //     await ENTITY.AdminStaffEntity.checkPermission(Constant.DATABASE.PERMISSION.TYPE.ARTICLE);
                // }
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
        path: '/v1/admin/article/{articleId}',
        handler: async (request, h) => {
            try {
                const adminData = request.auth && request.auth.credentials && (request.auth.credentials as any).adminData;
                const payload: ArticleRequest.DeleteArticle = request.params as any;
                // if (adminData.type === Constant.DATABASE.USER_TYPE.STAFF.TYPE) {
                //     await ENTITY.AdminStaffEntity.checkPermission(Constant.DATABASE.PERMISSION.TYPE.ARTICLE);
                // }
                const deletResponse = await ArticleService.deleteArticle(payload);
                // { "acknowledged" : true, "deletedCount" : 7 }
                // if (deletResponse['acknowledged'] === true || deletResponse['deletedCount'] > 0) {
                return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.DELETED, {}));
                // } else {
                // return (UniversalFunctions.sendError(Constant.STATUS_MSG.ERROR.E400.DEFAULT));
                // }
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

    /**
     * @description user get articles
     */
    {
        method: 'GET',
        path: '/v1/user/articles',
        handler: async (request, h) => {
            try {
                // const userData = request.auth && request.auth.credentials && request.auth.credentials.userData;
                const payload: ArticleRequest.GetArticle = request.query as any;
                const registerResponse = await ArticleService.getUserArticle(payload);
                return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.DEFAULT, registerResponse));
            } catch (error) {
                UniversalFunctions.consolelog('error', error, true);
                return (UniversalFunctions.sendError(error));
            }
        },
        options: {
            description: 'get articles for user application',
            tags: ['api', 'anonymous', 'user', 'user', 'Article'],
            auth: 'DoubleAuth',
            validate: {
                query: {
                    limit: Joi.number(),
                    page: Joi.number(),
                    // sortType: Joi.number().valid([Constant.ENUM.SORT_TYPE]),
                    // sortBy: Joi.string(),
                    type: Joi.string().lowercase().valid('selling'),
                    categoryId: Joi.string().when('type', { is: '', then: Joi.string().trim().required() }),
                    // articleId: Joi.string(),
                    searchTerm: Joi.string(),
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