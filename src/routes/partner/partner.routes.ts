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
                    name: Joi.string().required(),
                    displayName: Joi.string(),
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
        path: '/v1/nook/partner-redirect/{partnerSid}',
        handler: async (request, h) => {
            try {
                // const userData = request.auth && request.auth.credentials && (request.auth.credentials as any).userData;
                const payload = request.params as any;

                const data = await PartnerService.redirect(payload);
                console.log('datadata>>>>>>>>>>>>>>>', data);

                if (data) {
                    console.log('>>>>>>>>>>>>>>>>>>>>', config.get('homePage') + '/pre-qualification/' + data['shortId']);

                    return h.redirect(config.get('homePage') + '/pre-qualification/' + data['shortId']);
                    // nookdevangweb.appskeeper.com / pre - qualification / process / property - information
                } else {
                    return h.redirect(config.get('homePage'));
                }
                // return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.DEFAULT, data));
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

];