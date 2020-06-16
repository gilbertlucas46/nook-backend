import { ServerRoute } from 'hapi';
import * as UniversalFunction from '../../utils';
import { helpCenterRequest } from '@src/interfaces/helpCenter.interface';
import { HelpCenterService } from '@src/controllers/helpCenter/helpCenter.controller';
import * as UniversalFunctions from '../../utils';
import * as Constant from '../../constants';
import * as Joi from 'joi';
export let helpCenterRoute1: ServerRoute[] = [
    {
        method: 'POST',
        path: '/v1/admin/bank/help-center',
        handler: async (request, h) => {
            try {
                const adminData = request.auth && request.auth.credentials && (request.auth.credentials as any).adminData;
                const payload: helpCenterRequest.CreateHelpCenter = request.payload as any;
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
                // const permission = await UniversalFunctions.checkPermission(adminData, Constant.DATABASE.PERMISSION.TYPE.HELPCENTER_BANK);
                // console.log('permissionpermissionpermission', permission);

                const data = await HelpCenterService.createHelpCenter(payload, adminData);
                return UniversalFunction.sendSuccess(Constant.STATUS_MSG.SUCCESS.S201.CREATED, data);
            } catch (error) {
                UniversalFunctions.consolelog(error, 'error', true);
                return (UniversalFunction.sendError(error));
            }
        },
        options: {
            description: 'bank staff add helpcenter',
            tags: ['api', 'anonymous', 'user', 'updateAccount'],
            auth: 'AdminAuth',
            validate: {
                payload: {
                    title: Joi.string().trim(),
                    videoUrl: Joi.string().trim().allow(''),
                    description: Joi.string().trim(),
                    categoryId: Joi.number().valid([
                        Constant.DATABASE.HELP_CENTER_TYPE.BANK_FAQ.NUMBER,
                    ]),
                },
                headers: UniversalFunctions.authorizationHeaderObj,
                failAction: UniversalFunctions.failActionFunction,
            },
        },
    },

    {
        method: 'GET',
        path: '/v1/admin/bank/help-center/{id}',
        handler: async (request, h) => {
            try {
                const adminData = request.auth && request.auth.credentials && (request.auth.credentials as any)['adminData'];
                const payload: helpCenterRequest.GetHelpCenter = request.params as any;
                // const checkPermission = adminData['permission'].some(data => {
                //     return data.moduleName === Constant.DATABASE.PERMISSION.TYPE.HELP_CENTER;
                // });
                // if (checkPermission === false) {
                //     return UniversalFunctions.sendError(Constant.STATUS_MSG.ERROR.E401.UNAUTHORIZED);
                // }
                // const permission = await UniversalFunctions.checkPermission(adminData, Constant.DATABASE.PERMISSION.TYPE.HELP_CENTER);

                const data = await HelpCenterService.getHelpCenter(payload);
                // if (adminData.type === Constant.DATABASE.USER_TYPE.STAFF.TYPE) {
                //     await ENTITY.AdminStaffEntity.checkPermission(Constant.DATABASE.PERMISSION.TYPE.HELP_CENTER);
                // }
                return UniversalFunction.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.DEFAULT, data);
            } catch (error) {
                UniversalFunctions.consolelog(error, 'error', true);
                return (UniversalFunction.sendError(error));
            }
        },
        options: {
            description: 'get help center by id account type ',
            tags: ['api', 'anonymous', 'user', 'updateAccount'],
            auth: 'AdminAuth',
            validate: {
                params: {
                    id: Joi.string(),
                },
                headers: UniversalFunctions.authorizationHeaderObj,
                failAction: UniversalFunctions.failActionFunction,
            },
        },
    },

    {
        method: 'DELETE',
        path: '/v1/admin/bank/help-center/{id}',
        handler: async (request, h) => {
            try {
                const adminData = request.auth && request.auth.credentials && (request.auth.credentials as any)['adminData'];
                const payload: helpCenterRequest.DeleteHelpCenter = request.params as any;
                // if (adminData.type === Constant.DATABASE.USER_TYPE.STAFF.TYPE) {
                //     await ENTITY.AdminStaffEntity.checkPermission(Constant.DATABASE.PERMISSION.TYPE.HELP_CENTER);
                // }
                // const checkPermission = adminData['permission'].some(data => {
                //     return data.moduleName === Constant.DATABASE.PERMISSION.TYPE.HELP_CENTER;
                // });
                // if (checkPermission === false) {
                //     return UniversalFunctions.sendError(Constant.STATUS_MSG.ERROR.E401.UNAUTHORIZED);
                // }
                // const permission = await UniversalFunctions.checkPermission(adminData, Constant.DATABASE.PERMISSION.TYPE.HELP_CENTER);

                const data = await HelpCenterService.deleteHelpCenter(payload);
                return UniversalFunction.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.DELETED, data);
            } catch (error) {
                UniversalFunctions.consolelog(error, 'error', true);
                return (UniversalFunction.sendError(error));
            }
        },
        options: {
            description: 'delete the help ceneter by id ',
            tags: ['api', 'anonymous', 'user', 'delete helpcenter'],
            auth: 'AdminAuth',
            validate: {
                params: {
                    id: Joi.string(),
                },
                headers: UniversalFunctions.authorizationHeaderObj,
                failAction: UniversalFunctions.failActionFunction,
            },
        },
    },

    {
        method: 'PATCH',
        path: '/v1/admin/bank/help-center/{id}',
        handler: async (request, h) => {
            try {
                const adminData = request.auth && request.auth.credentials && (request.auth.credentials as any)['adminData'];
                const payload = {
                    ...request.params as any,
                    ...request.payload as helpCenterRequest.IupdateHelpCenter,
                };
                // const checkPermission = adminData['permission'].some(data => {
                //     return data.moduleName === Constant.DATABASE.PERMISSION.TYPE.HELP_CENTER;
                // });
                // if (checkPermission === false) {
                //     return UniversalFunctions.sendError(Constant.STATUS_MSG.ERROR.E401.UNAUTHORIZED);
                // }
                // const permission = await UniversalFunctions.checkPermission(adminData, Constant.DATABASE.PERMISSION.TYPE.HELP_CENTER);

                // if (adminData.type === Constant.DATABASE.USER_TYPE.STAFF.TYPE) {
                //     await ENTITY.AdminStaffEntity.checkPermission(Constant.DATABASE.PERMISSION.TYPE.HELP_CENTER);
                // }
                const data = await HelpCenterService.updateHelpCenter(payload, adminData);
                const responseData = UniversalFunction.formatUserData(data);
                return UniversalFunction.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.UPDATED, responseData);
            } catch (error) {
                UniversalFunctions.consolelog(error, 'error', true);
                return (UniversalFunction.sendError(error));
            }
        },
        options: {
            description: 'delete the help ceneter by id ',
            tags: ['api', 'anonymous', 'user', 'delete helpcenter'],
            auth: 'AdminAuth',
            validate: {
                params: {
                    id: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
                },
                payload: {
                    title: Joi.string(),
                    videoUrl: Joi.string().trim().allow('').optional(),
                    description: Joi.string(),
                    categoryId: Joi.number().valid([
                        Constant.DATABASE.HELP_CENTER_TYPE.BANK_FAQ.NUMBER,
                        // Constant.DATABASE.HELP_CENTER_TYPE.PROPERTIES.NUMBER,
                    ]),
                },
                headers: UniversalFunctions.authorizationHeaderObj,
                failAction: UniversalFunctions.failActionFunction,
            },
        },
    },

    // {
    //     method: 'GET',
    //     path: '/v1/admin/help-center-group',
    //     handler: async (request, h) => {
    //         try {
    //             const adminData = request.auth && request.auth.credentials && (request.auth.credentials as any)['userData'];
    //             // const payload: helpCenterRequest.DeleteHelpCenter = request.params as any;
    //             // if (adminData.type === Constant.DATABASE.USER_TYPE.STAFF.TYPE) {
    //             //     await ENTITY.AdminStaffEntity.checkPermission(Constant.DATABASE.PERMISSION.TYPE.HELP_CENTER);
    //             // }
    //             // const permission = await UniversalFunctions.checkPermission(adminData, Constant.DATABASE.PERMISSION.TYPE.HELP_CENTER);
    //             const data = await HelpCenterService.getHelpCenterCategoryBygroup();
    //             const responseData = UniversalFunction.formatUserData(data);
    //             return UniversalFunction.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.DEFAULT, responseData);
    //         } catch (error) {
    //             return (UniversalFunction.sendError(error));
    //         }
    //     },
    //     options: {
    //         description: 'delete the help ceneter by id ',
    //         tags: ['api', 'anonymous', 'user', 'delete helpcenter'],
    //         auth: 'AdminAuth',
    //         validate: {
    //             headers: UniversalFunctions.authorizationHeaderObj,
    //             failAction: UniversalFunctions.failActionFunction,
    //         },
    //     },
    // },
    // {
    //     method: 'GET',
    //     path: '/v1/admin/help-center-group/{id}',
    //     handler: async (request) => {
    //         try {
    //             const payload = request.params;
    //             const adminData = request.auth && request.auth.credentials && (request.auth.credentials as any)['adminData'];

    //             // const permission = await UniversalFunctions.checkPermission(adminData, Constant.DATABASE.PERMISSION.TYPE.HELP_CENTER);

    // const data = await HelpCenterService.getHelpCenterByCategoryId(payload);
    //             const responseData = UniversalFunction.formatUserData(data);
    //             return UniversalFunction.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.DEFAULT, responseData);
    //         } catch (error) {
    //             UniversalFunctions.consolelog('error', error, true);
    //             return (UniversalFunction.sendError(error));
    //         }
    //     },
    //     options: {
    //         description: 'Get help topics by id ',
    //         tags: ['api', 'anonymous', 'user', 'delete helpcenter'],
    //         auth: 'AdminAuth',
    //         validate: {
    //             params: {
    //                 id: Joi.number().valid([
    //                     Constant.DATABASE.HELP_CENTER_TYPE.BANK_FAQ.NUMBER,
    //                 ]),
    //             },
    //             headers: UniversalFunctions.authorizationHeaderObj,
    //             failAction: UniversalFunctions.failActionFunction,
    //         },
    //     },
    // },
];