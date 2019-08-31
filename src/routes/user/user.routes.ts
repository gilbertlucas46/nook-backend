"use strict";
import * as Joi from 'joi';
import * as UniversalFunctions from '../../utils';
import * as Constant from '../../constants/app.constant'
import { UserService } from '../../controllers'
import { join } from 'path';
import * as config from "config";
import * as utils from '../../utils'
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
                    email: Joi.string().min(4).max(100),
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
                    _id: Joi.string()
                },
                // headers: UniversalFunctions.authorizationHeaderObj,
                failAction: UniversalFunctions.failActionFunction
            },
        }
    },

    {
        method: "POST",
        path: "/v1/user/forgetPassword",
        handler: async (request, h) => {
            try {
                let payload: UserRequest.ForgetPassword = request.payload;
                console.log(`This request is on ${request.path} with parameters ${JSON.stringify(payload)}`);

                let forgetPasswordResponse = await UserService.forgetPassword(payload);
                console.log('forgetPasswordResponseforgetPasswordResponseforgetPasswordResponse', forgetPasswordResponse);

                // let result = UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S209.FORGET_PASSWORD_EMAIL, forgetPasswordResponse);

                let url = config.get("host.node") + ":" + config.get("host.port") + "/v1/user/verifyLink/" + forgetPasswordResponse

                return utils.sendSuccess(Constant.STATUS_MSG.SUCCESS.S209.FORGET_PASSWORD_EMAIL, { resetToken: url });
                // return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.DEFAULT, result))
            } catch (error) {
                let result = await UniversalFunctions.sendError(error);
                return error
            }
        },
        options: {
            description: "forget-password to user",
            tags: ["api", "anonymous", "user", "forget-password", "link"],
            // auth: "UserAuth",
            validate: {
                payload: {
                    email: Joi.string().email().lowercase().trim().required(),
                },
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
                    firstName: Joi.string().min(1).max(20).trim(),
                    lastName: Joi.string().min(1).max(20).trim(),
                    phoneNumber: Joi.string().min(8).max(14).trim(),
                    type: Joi.string().valid([
                        Constant.DATABASE.USER_TYPE.AGENT,
                        Constant.DATABASE.USER_TYPE.OWNER,
                        Constant.DATABASE.USER_TYPE.TENANT
                    ]),
                    title: Joi.string().allow(""),
                    license: Joi.string().allow(""),
                    taxnumber: Joi.string().allow(""),
                    faxNumber: Joi.string().allow(""),
                    fullPhoneNumber: Joi.string().allow(""),
                    language: Joi.string().allow(""),
                    companyName: Joi.string().allow(""),
                    address: Joi.string().allow(""),
                    aboutMe: Joi.string().allow(""),
                    profilePicUrl: Joi.string().allow(""),
                    backGroundImageUrl: Joi.string().allow("")
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
    // {
    //     method: 'POST',
    //     path: '/v1/user/verifyOtp',
    //     handler: async (request, h) => {
    //         try {
    //             let userData = request.auth && request.auth.credentials && request.auth.credentials.userData;
    //             let payload = request.query;
    //             // let responseData = await UserService.verifyOtp(payload);
    //             // return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.DEFAULT, responseData))
    //         }
    //         catch (error) {
    //             return (UniversalFunctions.sendError(error))
    //         }
    //     },
    //     options: {
    //         description: 'Get user Profile',
    //         tags: ['api', 'anonymous', 'user', 'Detail'],
    //         // auth: "UserAuth",
    //         validate: {
    //             query: {
    //                 otp: Joi.string().min(4).max(4),
    //                 email: Joi.string().email({ minDomainSegments: 2 }),
    //             },
    //             failAction: UniversalFunctions.failActionFunction
    //         },
    //         plugins: {
    //             'hapi-swagger': {
    //                 responseMessages: Constant.swaggerDefaultResponseMessages
    //             }
    //         }
    //     }
    // },
    {
        method: 'GET',
        path: '/v1/user/verifyLink/{link}',
        handler: async (request, h) => {
            try {
                let userData = request.auth && request.auth.credentials && request.auth.credentials.userData;
                let payload = request.params;
                let responseData = await UserService.verifyLink(payload);
                return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.DEFAULT, responseData))
                // return Response.redirect("https://nookdevang.appskeeper.com/for-sale")
            }
            catch (error) {
                return (UniversalFunctions.sendError(error))
            }
        },
        options: {
            description: 'Get user Profile',
            tags: ['api', 'anonymous', 'user', 'Detail'],
            // auth: "UserAuth",
            validate: {
                params: {
                    // otp: Joi.string().min(4).max(4),
                    // email: Joi.string().email({ minDomainSegments: 2 }),
                    link: Joi.string()
                },
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
        method: 'POST',
        path: '/v1/user/change-password',
        handler: async (request, h) => {
            try {
                let userData = request.auth && request.auth.credentials && request.auth.credentials.userData;
                let payload: UserRequest.ChangePassword = request.payload;
                let responseData = await UserService.changePassword(payload, userData);
                return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.DEFAULT, responseData))
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
                payload: {
                    oldPassword: Joi.string().min(6).max(14),
                    newPassword: Joi.string().min(6).max(14)
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

    {
        method: 'POST',
        path: '/v1/user/reset-password',
        handler: async (request, h) => {
            try {
                let userData = request.auth && request.auth.credentials && request.auth.credentials.userData;
                let payload: UserRequest.ChangePassword = request.query;
                let responseData = await UserService.resetPassword(payload, userData);
                return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.DEFAULT, responseData))
            }
            catch (error) {
                return (UniversalFunctions.sendError(error))
            }
        },
        options: {
            description: 'Get user Profile',
            tags: ['api', 'anonymous', 'user', 'reset'],
            validate: {
                query: {
                    password: Joi.string().min(6).max(14),

                },
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