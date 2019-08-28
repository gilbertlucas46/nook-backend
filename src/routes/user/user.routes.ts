"use strict";
import * as Joi from 'joi';
import * as UniversalFunctions from '../../utils';
import * as Constant from '../../constants/app.constant'
import { UserService } from '../../controllers'


export let userRoute = [
    {
        method: 'POST',
        path: '/v1/user/register',
        handler: async (request, h) => {
            try {
                let payload: UserRequest.Register = request.payload;
                let registerResponse = await UserService.register(payload);
                return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS, registerResponse))
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
                    email: Joi.string().min(1).max(20).trim().required(),
                    password: Joi.string().min(1).max(20).trim().required(),
                    firstName: Joi.string().min(1).max(20).trim().required(),
                    lastName: Joi.string().min(1).max(20).trim().required(),
                    phoneNumber: Joi.string().min(1).max(20).trim().required(),
                    type: Joi.string().valid([
                        Constant.DATABASE.USER_TYPE.AGENT,
                        Constant.DATABASE.USER_TYPE.OWNER,
                        Constant.DATABASE.USER_TYPE.TENANT
                    ])
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
                    email: Joi.string().min(1).max(20).trim().required(),
                    password: Joi.string().min(1).max(20).trim().required(),
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
            auth: "UserAuth",
            validate: {
                params: {
                    _id: Joi.string().min(24).max(24).required()
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