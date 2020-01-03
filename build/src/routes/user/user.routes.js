"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Joi = require("joi");
const UniversalFunctions = require("../../utils");
const Constant = require("../../constants/app.constant");
const controllers_1 = require("../../controllers");
const config = require("config");
const utils = require("../../utils");
exports.userRoute = [
    {
        method: 'POST',
        path: '/v1/user/register',
        handler: async (request, h) => {
            try {
                let payload = request.payload;
                let registerResponse = await controllers_1.UserService.register(payload);
                return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S201.CREATED, registerResponse));
            }
            catch (error) {
                return (UniversalFunctions.sendError(error));
            }
        },
        options: {
            description: 'Register to applications',
            tags: ['api', 'anonymous', 'user', 'register'],
            validate: {
                payload: {
                    userName: Joi.string().min(4).max(100).trim().required(),
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
                let registerResponse = await controllers_1.UserService.login(payload);
                return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.LOGIN, registerResponse));
            }
            catch (error) {
                return (UniversalFunctions.sendError(error));
            }
        },
        options: {
            description: 'login to applications',
            tags: ['api', 'anonymous', 'user', 'register'],
            validate: {
                payload: {
                    email: Joi.string().min(4).max(100),
                    password: Joi.string().min(6).max(14).trim().required(),
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
                let payload = request.params;
                let propertyDetail = await controllers_1.UserService.portpertyDetail(payload);
                return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.DEFAULT, propertyDetail));
            }
            catch (error) {
                return (UniversalFunctions.sendError(error));
            }
        },
        options: {
            description: 'get detail of property ',
            tags: ['api', 'anonymous', 'user', 'register'],
            validate: {
                params: {
                    _id: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
                },
                failAction: UniversalFunctions.failActionFunction
            },
        }
    },
    {
        method: "PATCH",
        path: "/v1/user/forgetPassword",
        handler: async (request, h) => {
            try {
                let payload = request.payload;
                let forgetPasswordResponse = await controllers_1.UserService.forgetPassword(payload);
                return utils.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.FORGET_PASSWORD_EMAIL, {});
            }
            catch (error) {
                let result = await UniversalFunctions.sendError(error);
                return error;
            }
        },
        options: {
            description: "forget-password to user",
            tags: ["api", "anonymous", "user", "forget-password", "link"],
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
                let payload = request.payload;
                let responseData = await controllers_1.UserService.updateProfile(payload);
                return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.UPDATED, responseData));
            }
            catch (error) {
                return (UniversalFunctions.sendError(error));
            }
        },
        options: {
            description: 'update user Profile',
            tags: ['api', 'anonymous', 'user', 'update'],
            validate: {
                payload: {
                    _id: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
                    firstName: Joi.string().min(1).max(20).trim(),
                    lastName: Joi.string().min(1).max(20).trim(),
                    phoneNumber: Joi.string().min(7).max(15).trim(),
                    type: Joi.string().valid([
                        Constant.DATABASE.USER_TYPE.AGENT.TYPE,
                        Constant.DATABASE.USER_TYPE.OWNER.TYPE,
                        Constant.DATABASE.USER_TYPE.TENANT.TYPE
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
                return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.DEFAULT, userData));
            }
            catch (error) {
                return (UniversalFunctions.sendError(error));
            }
        },
        options: {
            description: 'Get user Profile',
            tags: ['api', 'anonymous', 'user', 'Detail'],
            auth: "UserAuth",
            validate: {
                query: {},
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
                let payload = request.params;
                let responseData = await controllers_1.UserService.verifyLink(payload);
                return h.redirect(config.get("baseUrl") + payload.link);
            }
            catch (error) {
                if (error.JsonWebTokenError) {
                    return h.redirect(config.get("invalidUrl") + "invalid url");
                }
                else if (error == 'LinkExpired') {
                    return h.redirect(config.get("invalidUrl") + "LinkExpired");
                }
                else {
                    return h.redirect(config.get("invalidUrl") + "Something went wrong");
                }
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
        method: 'PATCH',
        path: '/v1/user/change-password',
        handler: async (request, h) => {
            try {
                let userData = request.auth && request.auth.credentials && request.auth.credentials.userData;
                let payload = request.payload;
                let responseData = await controllers_1.UserService.changePassword(payload, userData);
                return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.DEFAULT, responseData));
            }
            catch (error) {
                return (UniversalFunctions.sendError(error));
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
        method: 'PATCH',
        path: '/v1/user/reset-password',
        handler: async (request, h) => {
            try {
                let payload = request.payload;
                let responseData = await controllers_1.UserService.verifyLinkForResetPwd(payload);
                return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.DEFAULT, responseData));
            }
            catch (error) {
                if (error.JsonWebTokenError) {
                    return h.redirect(config.get("invalidUrl") + "invalid url");
                }
                else if (error === 'Already_Changed') {
                    return h.redirect(config.get("invalidUrl") + "Already_Changed");
                }
                else if (error === 'Time_Expired') {
                    return h.redirect(config.get("invalidUrl") + "Oops Time_Expired");
                }
                else {
                    return h.redirect(config.get("invalidUrl") + "Something went wrong");
                }
            }
        },
        options: {
            description: 'Get user Profile',
            tags: ['api', 'anonymous', 'user', 'reset'],
            validate: {
                payload: {
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
        method: 'GET',
        path: '/v1/user/dashboard',
        handler: async (request, h) => {
            try {
                let userData = request.auth && request.auth.credentials && request.auth.credentials.userData;
                console.log('userData', userData);
                let responseData = await controllers_1.UserService.dashboard(userData);
                return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.DEFAULT, responseData));
            }
            catch (error) {
                return UniversalFunctions.sendError(error);
            }
        },
        options: {
            description: 'Get user dashboard data',
            tags: ['api', 'anonymous', 'user', 'reset'],
            auth: "UserAuth",
            validate: {
                query: {},
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
];
//# sourceMappingURL=user.routes.js.map