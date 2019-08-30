"use strict";
import * as Joi from 'joi';
import * as UniversalFunctions from '../../utils';
import * as Constant from '../../constants/app.constant'
import { UserService } from '../../controllers'
import { join } from 'path';


export let userRoute = [
    {
        method: 'POST',
        path: '/v1/user/register',
        handler: async (request, h) => {
            try {
                let payload: UserRequest.Register = request.payload;
                let registerResponse = await UserService.register(payload);
                return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S201.CREATED, registerResponse))
            }
            catch (error) {
                return (UniversalFunctions.sendError(error))
            }
        },
        options: {
            description: 'Register to applications',
            tags: ['api', 'anonymous', 'user', 'register'],
            // auth: "BasicAuth"
            validate: {
                payload: {
                    userName: Joi.string().min(1).max(20).trim().required(),
                    email: Joi.string().email({ minDomainSegments: 2 }),
                    password: Joi.string().min(6).max(14).trim().required(),
                    // firstName: Joi.string().min(5).max(20).trim().optional(),
                    // lastName: Joi.string().min(5).max(20).trim().optional(),
                    // phoneNumber: Joi.string().min(8).max(12).trim().optional(),
                    // type: Joi.string().valid([
                    //     Constant.DATABASE.USER_TYPE.AGENT,
                    //     Constant.DATABASE.USER_TYPE.OWNER,
                    //     Constant.DATABASE.USER_TYPE.TENANT
                    // ])
                    // required: true,
                },
                failAction: UniversalFunctions.failActionFunction
            },
            plugins: {
                'hapi-swagger': {
                    // payloadType: 'form',
                    responseMessages: Constant.swaggerDefaultResponseMessages
                }
            }
        }
    },
    {
        method: 'POST',
        path: '/v1/user/login',
        handler: async (request, h) => {
            try {
                let payload = request.payload;
                console.log('payloadpayloadpayload', payload);

                let registerResponse = await UserService.login(payload);
                return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.LOGIN, registerResponse))
            }
            catch (error) {
                return (UniversalFunctions.sendError(error))
            }
        },
        options: {
            description: 'login to applications',
            tags: ['api', 'anonymous', 'user', 'register'],
            // auth: "BasicAuth"
            validate: {
                payload: {
                    email: Joi.string(),
                    password: Joi.string().min(6).max(14).trim().required(),
                    deviceId: Joi.string(),
                    deviceToken: Joi.string()
                },
                failAction: UniversalFunctions.failActionFunction
            },
            plugins: {
                'hapi-swagger': {
                    // payloadType: 'form',
                    responseMessages: Constant.swaggerDefaultResponseMessages
                }
            }
        }
    },

    {
        method: 'GET',
        path: '/v1/user/property/{_id}',
        handler: async (request, h) => {
            try {
                let payload: PropertyRequest.PropertyDetail = request.params;
                let propertyDetail = await UserService.portpertyDetail(payload);
                return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.DEFAULT, propertyDetail))
            }
            catch (error) {
                return (UniversalFunctions.sendError(error))
            }
        },
        options: {
            description: 'get detail of property ',
            tags: ['api', 'anonymous', 'user', 'register'],
            //  auth: "UserAuth",
            validate: {
                params: {
                    _id: Joi.string().min(24).max(24).required()
                },
                // headers: UniversalFunctions.authorizationHeaderObj,
                failAction: UniversalFunctions.failActionFunction
            },
        }
    },

    {
        method: "POST",
        path: "/v1/admin/forget-password",
        handler: async (request, h) => {
            try {
                // let payload: AdminRequest.ForgerPassword = request.payload;
                // console.log(`This request is on ${request.path} with parameters ${JSON.stringify(payload)}`);

                // let forgetPasswordResponse = await UserService.forgetPassword(payload);
                // let result = UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S209.FORGET_PASSWORD_EMAIL, forgetPasswordResponse);
                // return UniversalFunctions.sendLocalizedSuccessResponse(request, result);
            } catch (error) {
                let result = await UniversalFunctions.sendError(error);
                // return UniversalFunctions.sendLocalizedErrorResponse(request, result);
            }
        },
        options: {
            description: "forget-password to Admin",
            tags: ["api", "anonymous", "merchant", "forget-password"],
            auth: "UserAuth",
            validate: {
                payload: {
                    email: Joi.string().email().lowercase().trim().required(),
                },
                headers: UniversalFunctions.authorizationHeaderObj,
                failAction: UniversalFunctions.failActionFunction
            },
            plugins: {
                "hapi-swagger": {
                    responseMessages: Constant.swaggerDefaultResponseMessages
                }
            }
        }
    },
    {
        method: 'PATCH',
        path: '/v1/user/profile',
        handler: async (request, h) => {
            try {
                // let userData = request.auth && request.auth.credentials && request.auth.credentials.userData;
                let payload: UserRequest.ProfileUpdate = request.payload;
                let responseData = await UserService.updateProfile(payload);
                return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.UPDATED, responseData))
            }
            catch (error) {
                return (UniversalFunctions.sendError(error))
            }
        },
        options: {
            description: 'update user Profile',
            tags: ['api', 'anonymous', 'user', 'update'],
            // auth: "UserAuth",
            validate: {
                payload: {
                    _id: Joi.string().min(24).max(24).required(),
                    firstName: Joi.string().min(1).max(20).trim().required(),
                    lastName: Joi.string().min(1).max(20).trim().required(),
                    phoneNumber: Joi.string().min(8).max(14).trim().required(),
                    type: Joi.string().valid([
                        Constant.DATABASE.USER_TYPE.AGENT,
                        Constant.DATABASE.USER_TYPE.OWNER,
                        Constant.DATABASE.USER_TYPE.TENANT
                    ]),
                    title: Joi.string(),
                    license: Joi.string(),
                    taxnumber: Joi.string(),
                    faxNumber: Joi.string(),
                    fullPhoneNumber: Joi.string(),
                    language: Joi.string(),
                    companyName: Joi.string(),
                    address: Joi.string(),
                    aboutMe: Joi.string(),
                    profilePicUrl: Joi.string(),
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
    {
        method: 'GET',
        path: '/v1/user/profile',
        handler: async (request, h) => {
            try {
                let userData = request.auth && request.auth.credentials && request.auth.credentials.userData;
                console.log('userData', userData);

                return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.DEFAULT, userData))
            }
            catch (error) {
                return (UniversalFunctions.sendError(error))
            }
        },
        options: {
            description: 'Get user Profile',
            tags: ['api', 'anonymous', 'user', 'Detail'],
            auth: "UserAuth",
            validate: {
                query: {
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