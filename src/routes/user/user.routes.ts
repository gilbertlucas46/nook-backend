"use strict";
import * as Joi from 'joi';
import * as UniversalFunctions from '../../utils';
import * as Constant from '../../constants/app.constant'
import { UserService } from '../../controllers'
import * as config from "config";
import * as utils from '../../utils';

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
        path: '/v1/user/login',
        handler: async (request, h) => {
            try {
                let payload = request.payload;
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
                console.log(`This request is on ${request.path} with parameters ${JSON.stringify(payload)}`);
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
                // let result = UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S209.FORGET_PASSWORD_EMAIL, forgetPasswordResponse);
                let url = config.get("host") + ":" + config.get("port") + "/v1/user/verifyLink/" + forgetPasswordResponse
                return utils.sendSuccess(Constant.STATUS_MSG.SUCCESS.S209.FORGET_PASSWORD_EMAIL, {});
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
                console.log(`This request is on ${request.path} with parameters ${JSON.stringify(payload)}`);
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
                    title: Joi.string().allow("null").default(""),
                    license: Joi.string().allow("null").default(""),
                    taxnumber: Joi.string().allow("null").default(""),
                    faxNumber: Joi.string().allow("null").default(""),
                    fullPhoneNumber: Joi.string().allow("null").default(""),
                    language: Joi.string().allow("null").default(""),
                    companyName: Joi.string().allow("null").default(""),
                    address: Joi.string().allow("null").default(""),
                    aboutMe: Joi.string().allow("null").default(""),
                    profilePicUrl: Joi.string().allow("null").default(""),
                    backGroundImageUrl: Joi.string().allow("null").default("")
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
    {
        method: 'GET',
        path: '/v1/user/verifyLink/{link}',
        handler: async (request, h) => {
            try {
                let userData = request.auth && request.auth.credentials && request.auth.credentials.userData;
                let payload = request.params;
                let responseData = await UserService.verifyLink(payload);
                // return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.DEFAULT, responseData))
                console.log('config.get("BASE_URL") + `link`)', config.get("BASE_URL") + payload.link);

                return h.redirect(config.get("BASE_URL") + payload.link)
            }
            catch (error) {
                return h.redirect("https://www.w3schools.com/howto/howto_js_password_validation.asp")
                // return (UniversalFunctions.sendError(error))
            }
        },
        options: {
            description: 'Get user Profile',
            tags: ['api', 'anonymous', 'user', 'Detail'],
            validate: {
                params: {
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
                console.log(`This request is on ${request.path} with parameters ${JSON.stringify(payload)}`);
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
                let payload = request.query;
                console.log(`This request is on ${request.path} with parameters ${JSON.stringify(payload)}`);
                let responseData = await UserService.verifyLinkForResetPwd(payload);
                // let responseData = await UserService.resetPassword(payload);
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
                    link: Joi.string(),
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
    {
        method: 'POST',
        path: '/v1/user/send-mail',
        handler: async (request, h) => {
            try {
                let payload = request.query;
                console.log(`This request is on ${request.path} with parameters ${JSON.stringify(payload)}`);
                let responseData = await UserService.sendMail(payload);
                // let responseData = await UserService.resetPassword(payload);
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
                    email: Joi.string()
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