"use strict";
import * as Joi from 'joi';
import * as UniversalFunctions from '../../utils';
import * as Constant from '../../constants/app.constant'
import { EnquiryService } from '../../controllers';
import * as utils from '../../utils'
// import * as Constant from '../../constants/app.constant'


export let enquiryRoutes = [
    /**
     * @description:enquiry routes
     */
    {
        method: 'POST',
        path: '/v1/user/unauth/enquiry',
        handler: async (request, h) => {
            try {
                let payload: EnquiryRequest.createEnquiry = request.payload;
                let registerResponse = await EnquiryService.createEnquiry(payload);
                return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S201.ENQUIRY_SUBMITTED, registerResponse))
            }
            catch (error) {
                UniversalFunctions.consolelog('error', error, true)
                return (UniversalFunctions.sendError(error))
            }
        },
        options: {
            description: 'create Enquiry application',
            tags: ['api', 'anonymous', 'user', 'Enquiry'],
            // auth: "BasicAuth",
            validate: {
                payload: {
                    name: Joi.string().required(),
                    email: Joi.string().email({ minDomainSegments: 2 }).required(),
                    phoneNumber: Joi.string().required(),
                    message: Joi.string().required(),
                    propertyId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
                },
                // headers: UniversalFunctions.authorizationHeaderObj,
                failAction: UniversalFunctions.failActionFunction
            },
            plugins: {
                'hapi-swagger': {
                    responseMessages: Constant.swaggerDefaultResponseMessages
                }
            }
        }
    },
    /**
     *  after login add the enquiry
     */
    {
        method: 'POST',
        path: '/v1/user/enquiry',
        handler: async (request, h) => {
            try {
                let payload: EnquiryRequest.createEnquiry = request.payload;
                let registerResponse = await EnquiryService.createEnquiry(payload);
                return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.DEFAULT, registerResponse))
            }
            catch (error) {
                return (UniversalFunctions.sendError(error))
            }
        },
        options: {
            description: 'create Enquiry application',
            tags: ['api', 'anonymous', 'user', 'Enquiry'],
            auth: "UserAuth",
            validate: {
                payload: {
                    name: Joi.string().required(),
                    email: Joi.string().email({ minDomainSegments: 2 }).required(),
                    phoneNumber: Joi.string().required(),
                    message: Joi.string().required(),
                    propertyId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
                },
                headers: UniversalFunctions.authorizationHeaderObj,
                failAction: UniversalFunctions.failActionFunction
            },
            plugins: {
                'hapi-swagger': {
                    responseMessages: Constant.swaggerDefaultResponseMessages
                }
            }
        }
    },
    /**
     * 
     */
    {
        method: 'GET',
        path: '/v1/user/enquiry',
        handler: async (request, h) => {
            try {
                let userData = request.auth && request.auth.credentials && request.auth.credentials.userData
                // let payload: EnquiryRequest.getEnquiry = request.payload;
                let registerResponse = await EnquiryService.getEnquiryList(userData);
                return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.DEFAULT, registerResponse))
            }
            catch (error) {
                return (UniversalFunctions.sendError(error))
            }
        },
        options: {
            description: 'create Enquiry application',
            tags: ['api', 'anonymous', 'user', 'Enquiry'],
            auth: "UserAuth",
            validate: {
                // params: {
                //     userId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
                // },
                headers: UniversalFunctions.authorizationHeaderObj,
                failAction: UniversalFunctions.failActionFunction
            },
            plugins: {
                'hapi-swagger': {
                    responseMessages: Constant.swaggerDefaultResponseMessages
                }
            }
        }
    },

    /**
     * 
     */
    {
        method: 'GET',
        path: '/v1/user/enquiry/{enquiryId}',
        handler: async (request, h) => {
            try {
                let userData = request.auth && request.auth.credentials && request.auth.credentials.userData
                let payload: EnquiryRequest.getInquiryById = request.params;
                console.log('payload', payload);

                let registerResponse = await EnquiryService.getEnquiryById(payload);
                return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.DEFAULT, registerResponse))
            }
            catch (error) {
                return (UniversalFunctions.sendError(error))
            }
        },
        options: {
            description: 'create Enquiry application',
            tags: ['api', 'anonymous', 'user', 'Enquiry'],
            auth: "UserAuth",
            validate: {
                params: {
                    enquiryId: Joi.string().required()
                },
                headers: UniversalFunctions.authorizationHeaderObj,
                failAction: UniversalFunctions.failActionFunction
            },
            plugins: {
                'hapi-swagger': {
                    responseMessages: Constant.swaggerDefaultResponseMessages
                }
            }
        }
    },


]
