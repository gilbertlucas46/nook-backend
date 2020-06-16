'use strict';
import * as Joi from 'joi';
import { ServerRoute } from 'hapi';
import * as UniversalFunctions from '@src/utils';
import * as Constant from '@src/constants/app.constant';
import { PartnerService } from '@src/controllers';
import { PartnerAdminRequest } from '@src/interfaces/partner.interface';
import * as config from 'config';

export let partnerRoutes: ServerRoute[] = [

    {
        method: 'POST',
        path: '/v1/admin/partner',
        handler: async (request, h) => {
            try {
                const adminData = request.auth && request.auth.credentials && (request.auth.credentials as any).adminData;
                const payload = request.payload as PartnerAdminRequest.CreatePartner;

                const data = await PartnerService.createPartner(payload, adminData);
                return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S201.CREATED, {}));
            } catch (error) {
                UniversalFunctions.consolelog('error', error, true);
                return (UniversalFunctions.sendError(error));
            }
        },
        options: {
            description: 'admin create partner application',
            tags: ['api', 'anonymous', 'user', 'admin', 'staff', 'Article'],
            auth: 'AdminAuth',
            validate: {
                payload: {
                    logoUrl: Joi.string().uri().required(),
                    webUrl: Joi.string().required(),
                    name: Joi.string().required(),
                    displayName: Joi.string().optional(),
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
     * @description user show the info of the partner
     */

    {
        method: 'GET',
        path: '/v1/user/partner/{partnerSid}',
        handler: async (request, h) => {
            try {
                const userData = request.auth && request.auth.credentials && (request.auth.credentials as any).userData;
                const payload = request.params as any;

                const data = await PartnerService.getPartnerInfo(payload);
                return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.DEFAULT, data));
            } catch (error) {
                UniversalFunctions.consolelog('error', error, true);
                return (UniversalFunctions.sendError(error));
            }
        },
        options: {
            description: 'info of the partner application',
            tags: ['api', 'anonymous', 'partner', 'user', 'info'],
            auth: 'DoubleAuth',
            validate: {
                params: {
                    partnerSid: Joi.string().required(),
                },
                // payload: {
                //     logoUrl: Joi.string().uri().required(),
                //     name: Joi.string().required(),
                //     displayName: Joi.string(),
                // },
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
     * @description redirect to website
     */

    {
        method: 'GET',
        path: '/v1/nook/partner-redirect/{partnerSid}/{partnerName?}',
        handler: async (request, h) => {
            try {
                // const userData = request.auth && request.auth.credentials && (request.auth.credentials as any).userData;
                const payload = request.params as any;

                const data = await PartnerService.redirect(payload);
                console.log('datadata>>>>>>>>>>>>>>>', data);
                if (data) {
                    // console.log('>>>>>>>>>>>>>>>>>>>>', 'localhost:4200' + '?pre-qualification=' + data['shortId']);
                    // return 'localhost:4200' + '?pre-qualification=' + data['shortId'];
                    console.log('>>>>>>', config.get('homePage') + '/pre-qualification/process/property-information/' + data['shortId']);

                    return h.redirect(config.get('homePage') + '/pre-qualification/process/property-information/' + data['shortId']);
                } else {
                    return h.redirect(config.get('homePage'));
                }
            } catch (error) {
                console.log('errorerrorerror', error);
                return h.redirect(config.get('homePage'));
            }
        },
        options: {
            description: 'info of the partner application',
            tags: ['api', 'anonymous', 'partner', 'user', 'info'],
            // auth: 'DoubleAuth',
            validate: {
                params: {
                    partnerName: Joi.string().optional(),
                    partnerSid: Joi.string().required(),
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

    {
        method: 'PATCH',
        path: '/v1/admin/{status}/partner/{partnerSid}',
        handler: async (request, h) => {
            try {
                const adminAuth = request.auth && request.auth.credentials && (request.auth.credentials as any).adminAuth;
                const payload: PartnerAdminRequest.UpdateStatus = request.params as any;
                console.log('payloadpayload', payload);

                const data = await PartnerService.updatePartnerStatus(payload);
                return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.DEFAULT, {}));
            } catch (error) {
                console.log('errorerrorerror', error);
                return Promise.reject(error);
            }
        },
        options: {
            description: 'update partner status',
            tags: ['api', 'anonymous', 'partner', 'user', 'info'],
            auth: 'AdminAuth',
            validate: {
                params: {
                    partnerSid: Joi.string().required(),
                    status: Joi.string().valid([
                        Constant.DATABASE.PartnerStatus.ACTIVE,
                        Constant.DATABASE.PartnerStatus.BLOCK,
                        Constant.DATABASE.PartnerStatus.DELETE,
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

    {
        method: 'GET',
        path: '/v1/admin/partner',
        handler: async (request, h) => {
            try {
                const adminData = request.auth && request.auth.credentials && (request.auth.credentials as any).adminData;
                const payload: PartnerAdminRequest.GetPartners = request.query as any;

                const data = await PartnerService.getPartners(payload);
                return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.DEFAULT, data));
            } catch (error) {
                UniversalFunctions.consolelog('error', error, true);
                return (UniversalFunctions.sendError(error));
            }
        },
        options: {
            description: 'admin get partners',
            tags: ['api', 'anonymous', 'user', 'admin', 'staff', 'Article'],
            auth: 'AdminAuth',
            validate: {
                query: {
                    limit: Joi.number().default(10),
                    page: Joi.number().default(1),
                    // logoUrl: Joi.string().uri().required(),
                    // name: Joi.string().required(),
                    // displayName: Joi.string(),
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
        method: 'PATCH',
        path: '/v1/admin/partner/{partnerSid}',
        handler: async (request, h) => {
            try {
                const adminData = request.auth && request.auth.credentials && (request.auth.credentials as any).adminData;
                const payload: PartnerAdminRequest.UpdatePartner = {
                    ...request.params as any,
                    ...request.payload as any,
                };
                console.log('payloadpayloadpayload', payload);

                const data = await PartnerService.updatePartner(payload);
                return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.UPDATED, data));
            } catch (error) {
                UniversalFunctions.consolelog('error', error, true);
                return (UniversalFunctions.sendError(error));
            }
        },
        options: {
            description: 'admin update partner application',
            tags: ['api', 'anonymous', 'user', 'admin', 'partner'],
            auth: 'AdminAuth',
            validate: {
                params: {
                    partnerSid: Joi.string(),
                },
                payload: {
                    logoUrl: Joi.string().uri().required(),
                    webUrl: Joi.string().required(),
                    name: Joi.string().required(),
                    displayName: Joi.string().optional(),
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
        path: '/v1/admin/partner/{partnerSid}',
        handler: async (request, h) => {
            try {
                // const userData = request.auth && request.auth.credentials && (request.auth.credentials as any).adminData;
                const payload = request.params as any;

                const data = await PartnerService.adminGetPartnerInfo(payload);
                return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.DEFAULT, data));
            } catch (error) {
                UniversalFunctions.consolelog('error', error, true);
                return (UniversalFunctions.sendError(error));
            }
        },
        options: {
            description: 'info of the partner application for admin',
            tags: ['api', 'anonymous', 'partner', 'admin', 'info'],
            auth: 'AdminAuth',
            validate: {
                params: {
                    partnerSid: Joi.string().required(),
                },
                // payload: {
                //     logoUrl: Joi.string().uri().required(),
                //     name: Joi.string().required(),
                //     displayName: Joi.string(),
                // },
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