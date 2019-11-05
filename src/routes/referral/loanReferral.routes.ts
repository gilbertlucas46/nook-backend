import { Server, Request, ResponseToolkit } from 'hapi';
import * as Joi from 'joi';
import * as UniversalFunctions from '../../utils';
import * as Constant from '../../constants';
import { referralController } from '@src/controllers/loan/loanReferral.controller';
import { loanReferralRequest } from '@src/interfaces/loanReferral.interface';

export let loanReferral: any = [
    {
        method: 'POST',
        path: '/v1/user/referral',
        handler: async (request, h: ResponseToolkit) => {
            try {
                const userData = request.auth && request.auth.credentials && (request.auth.credentials).userData;
                const payload: loanReferralRequest.CreateReferral = request.payload;
                const data = referralController.createReferral(payload, userData);
                return UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S201.LOAN_REFERRAL, {});
            } catch (error) {
                return Promise.reject(error);
            }
        },
        options: {
            description: 'home loan referral',
            tags: ['api', 'user', 'home', 'loan', 'referral'],
            // Auth: 'UserAuth',
            validate: {
                payload: {
                    lastName: Joi.string(),
                    firstName: Joi.string(),
                    email: Joi.string().email(),
                    phoneNumber: Joi.string(),
                    notes: Joi.string(),
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
        path: '/v1/user/referral/{referralId}',
        handler: async (request, h: ResponseToolkit) => {
            try {
                const userData = request.auth && request.auth.credentials && (request.auth.credentials).userData;
                const payload: loanReferralRequest.GetReferral = request.params.referralId;
                const data = referralController.getReferral(payload);
                return UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S201.LOAN_REFERRAL, {});
            } catch (error) {
                return Promise.reject(error);
            }
        },
        options: {
            description: 'home loan referral',
            tags: ['api', 'user', 'home', 'loan', 'referral'],
            // Auth: 'UserAuth',
            validate: {
                params: {
                    referralId: Joi.string(),
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
        path: '/v1/user/referral',
        handler: async (request, h: ResponseToolkit) => {
            try {
                const userData = request.auth && request.auth.credentials && (request.auth.credentials).userData;
                const payload: loanReferralRequest.GetReferral = request.payload;
                const data = referralController.getUserReferral(payload, userData);
                return UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S201.LOAN_REFERRAL, {});
            } catch (error) {
                return Promise.reject(error);
            }
        },
        options: {
            description: 'home loan referral',
            tags: ['api', 'user', 'home', 'loan', 'referral'],
            // Auth: 'UserAuth',
            validate: {
                // param: {
                //     userId: Joi.string(),
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