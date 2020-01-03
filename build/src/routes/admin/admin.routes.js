"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Joi = require("joi");
const UniversalFunctions = require("../../utils");
const Constant = require("../../constants/app.constant");
const controllers_1 = require("../../controllers");
const config = require("config");
const utils = require("../../utils");
exports.adminProfileRoute = [
    {
        method: 'POST',
        path: '/v1/admin/login',
        handler: async (request, h) => {
            try {
                let payload = request.payload;
                let registerResponse = await controllers_1.AdminProfileService.login(payload);
                return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.LOGIN, registerResponse));
            }
            catch (error) {
                return (UniversalFunctions.sendError(error));
            }
        },
        options: {
            description: 'login to application',
            tags: ['api', 'anonymous', 'Admin', 'login'],
            validate: {
                payload: {
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
        method: "PATCH",
        path: "/v1/admin/forgetPassword",
        handler: async (request, h) => {
            try {
                let payload = request.payload;
                await controllers_1.AdminProfileService.forgetPassword(payload);
                return utils.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.FORGET_PASSWORD_EMAIL, {});
            }
            catch (error) {
                return await UniversalFunctions.sendError(error);
            }
        },
        options: {
            description: "forget-password to admin",
            tags: ["api", "anonymous", "admin", "forget-password", "link"],
            validate: {
                payload: {
                    email: Joi.string().email({ minDomainSegments: 2 }),
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
        path: '/v1/admin/profile',
        handler: async (request, h) => {
            try {
                let adminData = request.auth && request.auth.credentials && request.auth.credentials.adminData;
                let payload = request.payload;
                let responseData = await controllers_1.AdminProfileService.editProfile(payload, adminData);
                return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.UPDATED, responseData));
            }
            catch (error) {
                return (UniversalFunctions.sendError(error));
            }
        },
        options: {
            description: 'update admin Profile',
            tags: ['api', 'anonymous', 'admin', 'update'],
            auth: "AdminAuth",
            validate: {
                payload: {
                    firstName: Joi.string().min(1).max(20).trim(),
                    profilePicUrl: Joi.string().allow(""),
                    email: Joi.string().email({ minDomainSegments: 2 }),
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
        path: '/v1/admin/profile',
        handler: async (request, h) => {
            try {
                let adminData = request.auth && request.auth.credentials && request.auth.credentials.adminData;
                return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.DEFAULT, adminData));
            }
            catch (error) {
                return (UniversalFunctions.sendError(error));
            }
        },
        options: {
            description: 'Get Admin Profile',
            tags: ['api', 'anonymous', 'admin', 'Detail'],
            auth: "AdminAuth",
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
        path: '/v1/admin/verifyLink/{link}',
        handler: async (request, h) => {
            try {
                let payload = request.params;
                await controllers_1.AdminProfileService.verifyLink(payload);
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
            description: 'Get Admin Profile',
            tags: ['api', 'anonymous', 'Admin', 'Detail'],
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
        path: '/v1/admin/change-password',
        handler: async (request, h) => {
            try {
                let adminData = request.auth && request.auth.credentials && request.auth.credentials.adminData;
                let payload = request.payload;
                let responseData = await controllers_1.AdminProfileService.changePassword(payload, adminData);
                return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.DEFAULT, responseData));
            }
            catch (error) {
                return (UniversalFunctions.sendError(error));
            }
        },
        options: {
            description: 'Get admin Profile',
            tags: ['api', 'anonymous', 'admin', 'Detail'],
            auth: "AdminAuth",
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
        path: '/v1/admin/reset-password',
        handler: async (request, h) => {
            try {
                let payload = request.payload;
                let responseData = await controllers_1.AdminProfileService.verifyLinkForResetPwd(payload);
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
            description: 'Get Admin Profile',
            tags: ['api', 'anonymous', 'admin', 'reset'],
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
        path: '/v1/admin/property',
        handler: async (request, h) => {
            try {
                let adminData = request.auth && request.auth.credentials && request.auth.credentials.adminData;
                let payload = request.query;
                utils.consolelog('This request is on', `${request.path}with parameters ${JSON.stringify(payload)}`, true);
                let responseData = await controllers_1.AdminService.getProperty(payload, adminData);
                return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.DEFAULT, responseData));
            }
            catch (error) {
                return (UniversalFunctions.sendError(error));
            }
        },
        options: {
            description: 'Get admin properties',
            tags: ['api', 'anonymous', 'admin', 'Detail'],
            auth: "AdminAuth",
            validate: {
                query: {
                    page: Joi.number(),
                    limit: Joi.number(),
                    sortBy: Joi.number().valid([
                        Constant.DATABASE.PROPERTY_STATUS.ACTIVE.NUMBER,
                        Constant.DATABASE.PROPERTY_STATUS.PENDING.NUMBER,
                    ]),
                    sortType: Joi.number().valid(Constant.ENUM.SORT_TYPE)
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
        path: '/v1/admin/property/{propertyId}',
        handler: async (request, h) => {
            try {
                let payload = request.params;
                utils.consolelog('This request is on', `${request.path}with parameters ${JSON.stringify(payload)}`, true);
                let responseData = await controllers_1.AdminService.getPropertyById(payload);
                return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.DEFAULT, responseData));
            }
            catch (error) {
                return (UniversalFunctions.sendError(error));
            }
        },
        options: {
            description: 'admin Property detail',
            tags: ['api', 'anonymous', 'admin', 'Detail'],
            auth: "AdminAuth",
            validate: {
                params: {
                    propertyId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
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
        path: '/v1/admin/property/{propertyId}',
        handler: async (request, h) => {
            try {
                let adminData = request.auth && request.auth.credentials && request.auth.credentials.adminData;
                let payload = {
                    status: request.payload.status,
                    propertyId: request.params.propertyId
                };
                utils.consolelog('This request is on', `${request.path}with parameters ${JSON.stringify(payload)}`, true);
                let responseData = await controllers_1.AdminService.updatePropertyStatus(payload, adminData);
                return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.DEFAULT, responseData));
            }
            catch (error) {
                return (UniversalFunctions.sendError(error));
            }
        },
        options: {
            description: 'admin Property detail',
            tags: ['api', 'anonymous', 'admin', 'Detail'],
            auth: "AdminAuth",
            validate: {
                params: {
                    propertyId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
                },
                payload: {
                    status: Joi.number().valid([
                        Constant.DATABASE.PROPERTY_STATUS.ACTIVE.NUMBER,
                        Constant.DATABASE.PROPERTY_STATUS.DECLINED.NUMBER,
                    ])
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
];
//# sourceMappingURL=admin.routes.js.map