import { ServerRoute } from 'hapi';
import * as UniversalFunction from '../../utils';
import { helpCenterRequest } from '@src/interfaces/helpCenter.interface';
import { HelpCenterCategoryService } from '@src/controllers/helpCenter/helpcenter.category.controller';
import * as UniversalFunctions from '../../utils';
import * as Constant from '../../constants';
import * as Joi from 'joi';

export let helpCenterCategoryRoutes: ServerRoute[] = [
    /**
     * @description admin add helpcenter
     */
    {
        method: 'POST',
        path: '/v1/admin/help-category',
        handler: async (request, h) => {
            try {
                const adminData = request.auth && request.auth.credentials && (request.auth.credentials as any).adminData;
                const payload: helpCenterRequest.IhelpcenterCategoryAdd = request.payload as any;
                // if (adminData.type === Constant.DATABASE.USER_TYPE.STAFF.TYPE) {
                //     await ENTITY.AdminStaffEntity.checkPermission(Constant.DATABASE.PERMISSION.TYPE.HELP_CENTER);
                // }
                // const checkPermission = adminData['permission'].some(data => {
                //     return data.moduleName === Constant.DATABASE.PERMISSION.TYPE.HELP_CENTER;
                // });
                // if (checkPermission === false) {
                //     return UniversalFunctions.sendError(Constant.STATUS_MSG.ERROR.E401.UNAUTHORIZED);
                // }
                // const permission = await UniversalFunctions.checkPermission(adminData, payload.type);

                const data = await HelpCenterCategoryService.adminCreateCategory(payload, adminData);
                return UniversalFunction.sendSuccess(Constant.STATUS_MSG.SUCCESS.S201.CREATED, data);
            } catch (error) {
                UniversalFunctions.consolelog(error, 'error', true);
                return (UniversalFunction.sendError(error));
            }
        },
        options: {
            description: 'admin add helpcenter category',
            tags: ['api', 'anonymous', 'admin', 'helpcentercategory', 'add'],
            auth: 'AdminAuth',
            validate: {
                payload: {
                    name: Joi.string().required().lowercase(),
                    type: Joi.string().valid(
                        Constant.DATABASE.HELP_CENTER_TYPE.BANK_FAQ.TYPE,
                        Constant.DATABASE.HELP_CENTER_TYPE.STAFF_FAQ.TYPE,
                        // Constant.DATABASE.HELP_CENTER_TYPE.USER_FAQ.TYPE ,
                    ).required(),
                },
                headers: UniversalFunctions.authorizationHeaderObj,
                failAction: UniversalFunctions.failActionFunction,
            },
        },
    },

    /**
     * @description admin update hellpcenter catgopryname
     */

    {
        method: 'PATCH',
        path: '/v1/admin/help-category/{categoryId}',
        handler: async (request, h) => {
            try {
                const adminData = request.auth && request.auth.credentials && (request.auth.credentials as any).adminData;
                const payload: helpCenterRequest.IhelpCenterCategoryUpdate = {
                    ...request.params as any,
                    ...request.payload as any,
                };
                // if (adminData.type === Constant.DATABASE.USER_TYPE.STAFF.TYPE) {
                //     await ENTITY.AdminStaffEntity.checkPermission(Constant.DATABASE.PERMISSION.TYPE.HELP_CENTER);
                // }

                // const checkPermission = adminData['permission'].some(data => {
                //     return data.moduleName === Constant.DATABASE.PERMISSION.TYPE.HELP_CENTER;
                // });

                // if (checkPermission === false) {
                //     return UniversalFunctions.sendError(Constant.STATUS_MSG.ERROR.E401.UNAUTHORIZED);
                // }
                // const permission = await UniversalFunctions.checkPermission(adminData, payload.type);

                const data = await HelpCenterCategoryService.adminUpdateCategory(payload, adminData);
                return UniversalFunction.sendSuccess(Constant.STATUS_MSG.SUCCESS.S201.CREATED, data);
            } catch (error) {
                UniversalFunctions.consolelog(error, 'error', true);
                return (UniversalFunction.sendError(error));
            }
        },
        options: {
            description: 'admin update helpcenter category',
            tags: ['api', 'anonymous', 'admin', 'helpcentercategory', 'update'],
            auth: 'AdminAuth',
            validate: {
                params: {
                    categoryId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
                },
                payload: {
                    name: Joi.string().required().lowercase(),
                },
                headers: UniversalFunctions.authorizationHeaderObj,
                failAction: UniversalFunctions.failActionFunction,
            },
        },
    },

    {
        method: 'PATCH',
        path: '/v1/admin/help-category-status/{categoryId}',
        handler: async (request, h) => {
            try {
                const adminData = request.auth && request.auth.credentials && (request.auth.credentials as any).adminData;
                const payload: helpCenterRequest.IhelpCenterCategoryUpdate = {
                    ...request.params as any,
                    ...request.payload as any,
                };
                // if (adminData.type === Constant.DATABASE.USER_TYPE.STAFF.TYPE) {
                //     await ENTITY.AdminStaffEntity.checkPermission(Constant.DATABASE.PERMISSION.TYPE.HELP_CENTER);
                // }

                // const checkPermission = adminData['permission'].some(data => {
                //     return data.moduleName === Constant.DATABASE.PERMISSION.TYPE.HELP_CENTER;
                // });

                // if (checkPermission === false) {
                //     return UniversalFunctions.sendError(Constant.STATUS_MSG.ERROR.E401.UNAUTHORIZED);
                // }
                // const permission = await UniversalFunctions.checkPermission(adminData, payload.type);

                const data = await HelpCenterCategoryService.adminUpdateCatgoryStatus(payload, adminData);
                return UniversalFunction.sendSuccess(Constant.STATUS_MSG.SUCCESS.S201.CREATED, {});
            } catch (error) {
                UniversalFunctions.consolelog(error, 'error', true);
                return (UniversalFunction.sendError(error));
            }
        },
        options: {
            description: 'admin update helpcenter category',
            tags: ['api', 'anonymous', 'admin', 'helpcentercategory', 'update'],
            auth: 'AdminAuth',
            validate: {
                params: {
                    categoryId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
                },
                payload: {
                    status: Joi.string().valid(
                        Constant.DATABASE.HELP_CENTER_STATUS.ACTIVE,
                        Constant.DATABASE.HELP_CENTER_STATUS.DELETED,
                        Constant.DATABASE.HELP_CENTER_STATUS.BLOCKED,
                    ),
                },
                headers: UniversalFunctions.authorizationHeaderObj,
                failAction: UniversalFunctions.failActionFunction,
            },
        },
    },

    {
        method: 'GET',
        path: '/v1/admin/help-category',
        handler: async (request, h) => {
            try {
                const adminData = request.auth && request.auth.credentials && (request.auth.credentials as any).adminData;
                // const payload: helpCenterRequest.IhelpCenterCategoryUpdate = {
                //     ...request.params as any,
                //     ...request.payload as any,
                // };
                const payload = request.query;
                // if (adminData.type === Constant.DATABASE.USER_TYPE.STAFF.TYPE) {
                //     await ENTITY.AdminStaffEntity.checkPermission(Constant.DATABASE.PERMISSION.TYPE.HELP_CENTER);
                // }

                // const checkPermission = adminData['permission'].some(data => {
                //     return data.moduleName === Constant.DATABASE.PERMISSION.TYPE.HELP_CENTER;
                // });

                // if (checkPermission === false) {
                //     return UniversalFunctions.sendError(Constant.STATUS_MSG.ERROR.E401.UNAUTHORIZED);
                // }
                // const permission = await UniversalFunctions.checkPermission(adminData, payload.type);

                const data = await HelpCenterCategoryService.adminGetCategory(payload);
                return UniversalFunction.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.DEFAULT, data);
            } catch (error) {
                UniversalFunctions.consolelog(error, 'error', true);
                return (UniversalFunction.sendError(error));
            }
        },
        options: {
            description: 'admin get helpcenter catgetegory by type  and detail by id',
            tags: ['api', 'anonymous', 'admin', 'helpcenter category', 'type', 'get'],
            auth: 'AdminAuth',
            validate: {
                // params: {
                //     categoryId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
                // },
                query: {
                    type: Joi.string().valid([
                        Constant.DATABASE.HELP_CENTER_TYPE.BANK_FAQ.TYPE,
                        Constant.DATABASE.HELP_CENTER_TYPE.STAFF_FAQ.TYPE,
                        Constant.DATABASE.HELP_CENTER_TYPE.USER_FAQ.TYPE,
                    ]).required(),
                    // categoryId: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
                    limit: Joi.number(),
                    page: Joi.number(),
                    // type: Joi.string().valid(
                    //     Constant.DATABASE.HELP_CENTER_TYPE.BANK_FAQ.TYPE,
                    //     Constant.DATABASE.HELP_CENTER_TYPE.STAFF_FAQ.TYPE ,
                    //     // Constant.DATABASE.HELP_CENTER_STATUS.ACTIVE,
                    //     // Constant.DATABASE.HELP_CENTER_STATUS.DELETED,
                    //     // Constant.DATABASE.HELP_CENTER_STATUS.BLOCKED,
                    // ),
                },
                headers: UniversalFunctions.authorizationHeaderObj,
                failAction: UniversalFunctions.failActionFunction,
            },
        },
    },


    {
        method: 'GET',
        path: '/v1/admin/help-category/{categoryId}',
        handler: async (request, h) => {
            try {
                const adminData = request.auth && request.auth.credentials && (request.auth.credentials as any).adminData;
                // const payload: helpCenterRequest.IhelpCenterCategoryUpdate = {
                //     ...request.params as any,
                //     ...request.payload as any,
                // };
                const payload = request.params;
                // if (adminData.type === Constant.DATABASE.USER_TYPE.STAFF.TYPE) {
                //     await ENTITY.AdminStaffEntity.checkPermission(Constant.DATABASE.PERMISSION.TYPE.HELP_CENTER);
                // }

                // const checkPermission = adminData['permission'].some(data => {
                //     return data.moduleName === Constant.DATABASE.PERMISSION.TYPE.HELP_CENTER;
                // });

                // if (checkPermission === false) {
                //     return UniversalFunctions.sendError(Constant.STATUS_MSG.ERROR.E401.UNAUTHORIZED);
                // }
                // const permission = await UniversalFunctions.checkPermission(adminData, payload.type);

                const data = await HelpCenterCategoryService.adminCategoryDetail(payload);
                return UniversalFunction.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.DEFAULT, data);
            } catch (error) {
                UniversalFunctions.consolelog(error, 'error', true);
                return (UniversalFunction.sendError(error));
            }
        },
        options: {
            description: 'admin get helpcanter category details by id',
            tags: ['api', 'anonymous', 'admin', 'helpcenter category', 'detail', 'get'],
            auth: 'AdminAuth',
            validate: {
                params: {
                    categoryId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
                },
                headers: UniversalFunctions.authorizationHeaderObj,
                failAction: UniversalFunctions.failActionFunction,
            },
        },
    },
];