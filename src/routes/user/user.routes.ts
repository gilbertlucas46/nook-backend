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
        method: 'POST',
        path: '/v1/user/verify-Token',
        handler: async (request, h) => {
            try {
                let payload: string = request.auth.credentials.token;
                let registerResponse = await UserService.verifyToken(payload);
                return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.LOGIN, registerResponse))
            }
            catch (error) {
                return (UniversalFunctions.sendError(error))
            }
        },
        options: {
            description: 'Register to applications',
            tags: ['api', 'anonymous', 'user', 'register'],
            auth: "UserAuth",
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
        method: 'PATCH',
        path: '/v1/user/forgetPassword',
        handler: async (request, h) => {
            try {
                let payload = request.payload;
                let responseData = await UserService.register(payload);
                return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS, responseData))
            }
            catch (error) {
                return (UniversalFunctions.sendError(error))
            }
        },
        options: {
            description: 'Forget Password',
            tags: ['api', 'anonymous', 'user', 'register'],
            // auth: "BasicAuth"
            validate: {
                payload: {
                    email: Joi.string().email({ minDomainSegments: 2 })
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
        path: '/v1/user/add-property',
        handler: async (request, h) => {
            try {
                let userData = request.auth && request.auth.credentials && request.auth.credentials.userData;
                let payload: string = request.payload;
                let registerResponse = await UserService.addProperty(payload, userData);
                return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.LOGIN, registerResponse))
            }
            catch (error) {
                return (UniversalFunctions.sendError(error))
            }
        },
        options: {
            description: 'Register Property',
            tags: ['api', 'anonymous', 'property', 'register'],
            auth: "UserAuth",
            validate: {
                payload: {
                    property_details: {
                        floor_area: Joi.string().min(1).max(20).trim().required(),
                        floor_area_unit: Joi.string().min(1).max(20).trim().required(),
                        land_area: Joi.number(),
                        land_area_unit: Joi.string().min(1).max(20).trim().required(),
                        bedrooms: Joi.number(),
                        bathrooms: Joi.number(),
                        Garages: Joi.number(),
                        buildYear: Joi.number()
                    },
                    property_address: {
                        address: Joi.string().min(1).max(20).trim().required(),
                        region: Joi.string().min(1).max(20).trim().required(),
                        city: Joi.string().min(1).max(20).trim().required(),
                        Barangay: Joi.string().min(1).max(20).trim().required(),
                        location: {
                            type: Joi.string().min(1).max(20).trim().required(),  // need to change
                            coordinates: Joi.number()
                        }
                    },
                    property_basic_details: {
                        title: Joi.string().min(1).max(20).trim().required(),
                        description: Joi.string().min(1).max(20).trim().required(),
                        type: Joi.string().min(1).max(20).trim().required(),
                        status: Joi.string().min(1).max(20).trim().required(),
                        label: Joi.string().min(1).max(20).trim().required(),
                        sale_rent_price: Joi.number(),
                        price_currency: Joi.string().min(1).max(20).trim().required(),
                        price_label: Joi.string().min(1).max(20).trim().required(), // monthly
                    },
                    property_features: {
                        storeys_2: Joi.boolean().valid([true, false]),
                        security_24hr: Joi.boolean().valid([true, false]),
                        air_conditioning: Joi.boolean().valid([true, false]),
                        balcony: Joi.boolean().valid([true, false]),
                        basketball_court: Joi.boolean().valid([true, false]),
                        business_center: Joi.boolean().valid([true, false]),
                        carpark: Joi.boolean().valid([true, false]),
                        CCTV_monitoring: Joi.boolean().valid([true, false]),
                        child_playground: Joi.boolean().valid([true, false]),
                        clothes_dryer: Joi.boolean().valid([true, false]),
                        club_house: Joi.boolean().valid([true, false]),
                        day_care: Joi.boolean().valid([true, false]),
                        den: Joi.boolean().valid([true, false]),
                        fully_furnished: Joi.boolean().valid([true, false]),
                        function_Room: Joi.boolean().valid([true, false]),
                        garden: Joi.boolean().valid([true, false]),
                        gym: Joi.boolean().valid([true, false]),
                        laundry: Joi.boolean().valid([true, false]),
                        loft: Joi.boolean().valid([true, false]),
                        maids_room: Joi.boolean().valid([true, false]),
                        microwave: Joi.boolean().valid([true, false]),
                        parking: Joi.boolean().valid([true, false]),
                        pet_friendly: Joi.boolean().valid([true, false]),
                        refrigerator: Joi.boolean().valid([true, false]),
                        semi_furnished: Joi.boolean().valid([true, false]),
                        sky_deck: Joi.boolean().valid([true, false]),
                        spa: Joi.boolean().valid([true, false]),
                        swimming_pool: Joi.boolean().valid([true, false]),
                        tennis_court: Joi.boolean().valid([true, false]),
                        TV_cable: Joi.boolean().valid([true, false]),
                        unfurnished: Joi.boolean().valid([true, false]),
                        washing_machine: Joi.boolean().valid([true, false]),
                        wiFi: Joi.boolean().valid([true, false]),
                    },
                    propertyImages: Joi.array().required()
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
    }
]