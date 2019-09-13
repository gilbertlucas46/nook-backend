"use strict";
import * as Joi from 'joi';
import * as UniversalFunctions from '../../utils';
import * as Constant from '../../constants/app.constant'
import { AdminProfileService, AdminService } from '../../controllers'
import * as config from "config";
import * as utils from '../../utils';

export let adminProfileRoute = [
    /**
     * @description:Login via mail
     */
    {
        method: 'POST',
        path: '/v1/admin/login',
        handler: async (request, h) => {
            try {
                let payload = request.payload;
                let registerResponse = await AdminProfileService.login(payload);
                return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.LOGIN, registerResponse))
            }
            catch (error) {
                return (UniversalFunctions.sendError(error))
            }
        },
        options: {
            description: 'login to application',
            tags: ['api', 'anonymous', 'Admin', 'login'],
            // auth: "BasicAuth"
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

    /**
     * 
     * @description: forget passsword to send the link over mail 
     */
    {
        method: "PATCH",
        path: "/v1/admin/forgetPassword",
        handler: async (request, h) => {
            try {
                let payload: UserRequest.ForgetPassword = request.payload;
                await AdminProfileService.forgetPassword(payload);
                return utils.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.FORGET_PASSWORD_EMAIL, {});
            } catch (error) {
                return await UniversalFunctions.sendError(error);
            }
        },
        options: {
            description: "forget-password to admin",
            tags: ["api", "anonymous", "admin", "forget-password", "link"],
            // auth: "AdminAuth",
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
    /**
     * @description : update the admin Profile
     */
    {
        method: 'PATCH',
        path: '/v1/admin/profile',
        handler: async (request, h) => {
            try {
                let adminData = request.auth && request.auth.credentials && request.auth.credentials.adminData;
                let payload: UserRequest.ProfileUpdate = request.payload;
                let responseData = await AdminProfileService.editProfile(payload, adminData);
                return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.UPDATED, responseData))
            }
            catch (error) {
                return (UniversalFunctions.sendError(error))
            }
        },
        options: {
            description: 'update admin Profile',
            tags: ['api', 'anonymous', 'admin', 'update'],
            auth: "AdminAuth",
            validate: {
                payload: {
                    // _id: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
                    firstName: Joi.string().min(1).max(20).trim(),
                    // lastName: Joi.string().min(1).max(20).trim(),
                    // phoneNumber: Joi.string().min(7).max(15).trim(),
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
    /**
     * @description :Admin profile detail via token 
     */
    {
        method: 'GET',
        path: '/v1/admin/profile',
        handler: async (request, h) => {
            try {
                let adminData = request.auth && request.auth.credentials && request.auth.credentials.adminData;
                return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.DEFAULT, adminData))
            }
            catch (error) {
                return (UniversalFunctions.sendError(error))
            }
        },
        options: {
            description: 'Get Admin Profile',
            tags: ['api', 'anonymous', 'admin', 'Detail'],
            auth: "AdminAuth",
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
    /**
     * @description : user verifLink for the reset-password
     */
    {
        method: 'GET',
        path: '/v1/admin/verifyLink/{link}',
        handler: async (request, h) => {
            try {
                let payload = request.params;
                await AdminProfileService.verifyLink(payload);
                return h.redirect(config.get("baseUrl") + payload.link)
            } catch (error) {
                if (error.JsonWebTokenError) {
                    return h.redirect(config.get("invalidUrl") + "invalid url")
                } else if (error == 'LinkExpired') {
                    return h.redirect(config.get("invalidUrl") + "LinkExpired")
                } else {
                    return h.redirect(config.get("invalidUrl") + "Something went wrong")
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
    /**
     * @description: Admin change passsword 
     */
    {
        method: 'PATCH',
        path: '/v1/admin/change-password',
        handler: async (request, h) => {
            try {
                let adminData = request.auth && request.auth.credentials && request.auth.credentials.adminData;
                let payload: AdminRequest.ChangePassword = request.payload;
                let responseData = await AdminProfileService.changePassword(payload, adminData);
                return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.DEFAULT, responseData))
            }
            catch (error) {
                return (UniversalFunctions.sendError(error))
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
    /**
     * @description : reset-password send the verify token adnd the password in the query
     */
    {
        method: 'PATCH',
        path: '/v1/admin/reset-password',
        handler: async (request, h) => {
            try {
                let payload = request.payload;
                let responseData = await AdminProfileService.verifyLinkForResetPwd(payload);
                return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.DEFAULT, responseData))
            }
            catch (error) {
                if (error.JsonWebTokenError) {
                    return h.redirect(config.get("invalidUrl") + "invalid url")
                } else if (error === 'Already_Changed') {
                    return h.redirect(config.get("invalidUrl") + "Already_Changed")
                } else if (error === 'Time_Expired') {
                    return h.redirect(config.get("invalidUrl") + "Oops Time_Expired")
                } else {
                    return h.redirect(config.get("invalidUrl") + "Something went wrong")
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
                let payload: AdminRequest.PropertyList = request.query;
                utils.consolelog('This request is on', `${request.path}with parameters ${JSON.stringify(payload)}`, true)
                let responseData = await AdminService.getProperty(payload, adminData);
                return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.DEFAULT, responseData))
            }
            catch (error) {
                return (UniversalFunctions.sendError(error))
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
                        // propertyStatus: Joi.number().valid([
                        Constant.DATABASE.PROPERTY_STATUS.ACTIVE.NUMBER,
                        Constant.DATABASE.PROPERTY_STATUS.PENDING.NUMBER,                        // ]),
                    ]),
                    sortType: Joi.number().valid(Constant.ENUM.SORT_TYPE)
                    // searchTerm: Joi.string(),),
                    // propertyType: Joi.number()
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
                // let adminData = request.auth && request.auth.credentials && request.auth.credentials.adminData;
                let payload: AdminRequest.PropertyDetail = request.params;
                utils.consolelog('This request is on', `${request.path}with parameters ${JSON.stringify(payload)}`, true)
                let responseData = await AdminService.getPropertyById(payload);
                return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.DEFAULT, responseData))
            }
            catch (error) {
                return (UniversalFunctions.sendError(error))
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
                let payload: AdminRequest.UpdatePropertyStatus = {
                    status: request.payload.status,
                    propertyId: request.params.propertyId
                }

                utils.consolelog('This request is on', `${request.path}with parameters ${JSON.stringify(payload)}`, true)
                let responseData = await AdminService.updatePropertyStatus(payload, adminData);
                return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.DEFAULT, responseData))
            }
            catch (error) {
                return (UniversalFunctions.sendError(error))
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
                        // Constant.DATABASE.PROPERTY_STATUS.,
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

]
