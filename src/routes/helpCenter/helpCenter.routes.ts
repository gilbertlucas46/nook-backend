import { ServerRoute } from 'hapi';
import * as UniversalFunction from '../../utils';
import { helpCenterRequest } from '@src/interfaces/helpCenter.interface';
import { HelpCenterService } from '@src/controllers/helpCenter/helpCenter.controller';
import * as UniversalFunctions from '../../utils';
import * as Constant from '../../constants';
import * as Joi from 'joi';
export let helpCenterRoute: ServerRoute[] = [
    {
        method: 'POST',
        path: '/v1/admin/help-center',
        handler: async (request, h) => {
            try {
                const adminData = request.auth && request.auth.credentials && (request.auth.credentials as any)['adminData'];
                const payload: helpCenterRequest.CreateHelpCenter = request.payload as any;
                const data = await HelpCenterService.createHelpCenter(payload, adminData);
                return UniversalFunction.sendSuccess(Constant.STATUS_MSG.SUCCESS.S201.CREATED, data);
            } catch (error) {
                return (UniversalFunction.sendError(error));
            }
        },
        options: {
            description: 'update account type ',
            tags: ['api', 'anonymous', 'user', 'updateAccount'],
            auth: 'AdminAuth',
            validate: {
                payload: {
                    title: Joi.string(),
                    videoUrl: Joi.string(),
                    description: Joi.string(),
                    categoryId: Joi.number().valid([
                        Constant.DATABASE.HELP_CENTER_TYPE.ACCOUNT.NUMBER,
                        Constant.DATABASE.HELP_CENTER_TYPE.BILLING.NUMBER,
                        Constant.DATABASE.HELP_CENTER_TYPE.HOME_LOANS.NUMBER,
                        Constant.DATABASE.HELP_CENTER_TYPE.PROPERTIES.NUMBER,
                    ]),
                },
                headers: UniversalFunctions.authorizationHeaderObj,
                failAction: UniversalFunctions.failActionFunction,
            },
        },
    },

    {
        method: 'GET',
        path: '/v1/user/help-center/{categoryId}',
        handler: async (request, h) => {
            try {
                // const adminData = request.auth && request.auth.credentials && (request.auth.credentials as any)['adminData'];
                const payload: helpCenterRequest.GetHelpCenter = request.params as any;
                const data = await HelpCenterService.getHelpCenter(payload);
                return UniversalFunction.sendSuccess(Constant.STATUS_MSG.SUCCESS.S201.CREATED, data);
            } catch (error) {
                console.log('error>>>>>>>>>>>>>>>>>>>>>>>>>>>', error);
                return (UniversalFunction.sendError(error));
            }
        },
        options: {
            description: 'get help center by id account type ',
            tags: ['api', 'anonymous', 'user', 'updateAccount'],
            auth: 'AdminAuth',
            validate: {
                params: {
                    categoryId: Joi.number().valid([
                        Constant.DATABASE.HELP_CENTER_TYPE.ACCOUNT.NUMBER,
                        Constant.DATABASE.HELP_CENTER_TYPE.BILLING.NUMBER,
                        Constant.DATABASE.HELP_CENTER_TYPE.HOME_LOANS.NUMBER,
                        Constant.DATABASE.HELP_CENTER_TYPE.PROPERTIES.NUMBER,
                    ]),
                },
                headers: UniversalFunctions.authorizationHeaderObj,
                failAction: UniversalFunctions.failActionFunction,
            },
        },
    },

    {
        method: 'DELETE',
        path: '/v1/user/help-center/{id}',
        handler: async (request, h) => {
            try {
                // const adminData = request.auth && request.auth.credentials && (request.auth.credentials as any)['adminData'];
                const payload: helpCenterRequest.DeleteHelpCenter = request.params as any;
                const data = await HelpCenterService.deleteHelpCenter(payload);
                return UniversalFunction.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.DELETED, data);
            } catch (error) {
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
        path: '/v1/admin/help-center/{id}',
        handler: async (request, h) => {
            try {
                const adminData = request.auth && request.auth.credentials && (request.auth.credentials as any)['adminData'];
                const payload = {
                    ...request.params,
                    // ...request.payload,
                };
                // const payload: helpCenterRequest.DeleteHelpCenter = request.params as any;
                const data = await HelpCenterService.updateHelpCenter(payload, adminData);
                const responseData = UniversalFunction.formatUserData(data);
                return UniversalFunction.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.UPDATED, responseData);
            } catch (error) {
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
                    videoUrl: Joi.string(),
                    description: Joi.string(),
                    categoryId: Joi.number().valid([
                        Constant.DATABASE.HELP_CENTER_TYPE.ACCOUNT.NUMBER,
                        Constant.DATABASE.HELP_CENTER_TYPE.BILLING.NUMBER,
                        Constant.DATABASE.HELP_CENTER_TYPE.HOME_LOANS.NUMBER,
                        Constant.DATABASE.HELP_CENTER_TYPE.PROPERTIES.NUMBER,
                    ]),
                },
                headers: UniversalFunctions.authorizationHeaderObj,
                failAction: UniversalFunctions.failActionFunction,
            },
        },
    },
];