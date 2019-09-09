"use strict";
import * as Joi from 'joi';
import * as UniversalFunctions from '../../utils';
import * as Constant from '../../constants/app.constant'
import { PropertyService } from '../../controllers'

export let propertyRoute = [
    /**
     * @description: user add property
     */
    {
        method: 'POST',
        path: '/v1/user/property',
        handler: async (request, h) => {
            try {
                let userData = request.auth && request.auth.credentials && request.auth.credentials.userData;
                let payload: PropertyRequest.PropertyData = request.payload;
                if (payload.propertyId) {
                    let registerResponse = await PropertyService.addProperty(payload, userData);
                    return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.UPDATED, registerResponse))
                } else {
                    let registerResponse = await PropertyService.addProperty(payload, userData);
                    return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S201.PROPERTY_ADDED, registerResponse))
                }
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
                    propertyId: Joi.string().min(24).max(24).optional(),
                    property_details: {
                        floor_area: Joi.number(),
                        lot_area: Joi.number(),
                        bedrooms: Joi.number(),
                        bathrooms: Joi.number(),
                        garages: Joi.number(),
                        garage_size: Joi.number(),
                        buildYear: Joi.number()
                    },
                    property_address: {
                        address: Joi.string().min(1).max(300).trim().required(),
                        region: Joi.string().min(1).max(100).trim().required(),
                        city: Joi.string().min(1).max(100).trim().required(),
                        barangay: Joi.string().min(1).max(100).trim(),
                        location: {
                            coordinates: Joi.array().ordered([
                                Joi.number().min(-180).max(180).required(),
                                Joi.number().min(-90).max(90).required()
                            ]),
                        }
                    },
                    property_basic_details: {
                        title: Joi.string().min(1).max(200).trim().required(),
                        description: Joi.string().min(1).max(10000).trim().required(),
                        type: Joi.string().valid([
                            Constant.DATABASE.PROPERTY_TYPE.NONE,
                            Constant.DATABASE.PROPERTY_TYPE["APPARTMENT/CONDO"],
                            Constant.DATABASE.PROPERTY_TYPE.COMMERCIAL,
                            Constant.DATABASE.PROPERTY_TYPE.HOUSE_LOT,
                            Constant.DATABASE.PROPERTY_TYPE.LAND,
                            Constant.DATABASE.PROPERTY_TYPE.ROOM,
                        ]),
                        status: Joi.number(),
                        label: Joi.string().valid([
                            Constant.DATABASE.PROPERTY_LABEL.NONE,
                            Constant.DATABASE.PROPERTY_LABEL.FORECLOSURE,
                            Constant.DATABASE.PROPERTY_LABEL.OFFICE,
                            Constant.DATABASE.PROPERTY_LABEL.PARKING,
                            Constant.DATABASE.PROPERTY_LABEL.PRE_SELLING,
                            Constant.DATABASE.PROPERTY_LABEL.READY_FOR_OCCUPANCY,
                            Constant.DATABASE.PROPERTY_LABEL.RENT_TO_OWN,
                            Constant.DATABASE.PROPERTY_LABEL.RETAIL,
                            Constant.DATABASE.PROPERTY_LABEL.SERVICED_OFFICE,
                            Constant.DATABASE.PROPERTY_LABEL.WAREHOUSE,
                        ]),
                        sale_rent_price: Joi.number(),
                        price_currency: Joi.string().min(1).max(20).trim(),
                        price_label: Joi.string().valid([
                            Constant.DATABASE.PRICE_LABEL.DAILY,
                            Constant.DATABASE.PRICE_LABEL.WEEKLY,
                            Constant.DATABASE.PRICE_LABEL.MONTHLY,
                            Constant.DATABASE.PRICE_LABEL.QUATERLY,
                            Constant.DATABASE.PRICE_LABEL.HALFYEARLY,
                            Constant.DATABASE.PRICE_LABEL.YEARLY,
                        ]),
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
    },
    /**
     * @description :Property List
     */
    {
        method: 'GET',
        path: '/v1/user/propertyList',
        handler: async (request, h) => {
            try {
                let propertyList = await PropertyService.searchProperties(request.query);
                return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.UPDATED, propertyList))
            }
            catch (error) {
                return (UniversalFunctions.sendError(error))
            }
        },
        options: {
            description: 'GET properties',
            tags: ['api', 'anonymous', 'user', 'update'],
            //  auth: "UserAuth",
            validate: {
                query: {
                    page: Joi.number(),
                    limit: Joi.number(),
                    searchTerm: Joi.string(),
                    type: Joi.string(),
                    label: Joi.array(),
                    maxPrice: Joi.number(),
                    minPrice: Joi.number(),
                    propertyType: Joi.number()
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
     * @description : near by peoperty listing based on the radius
     */
    {
        method: 'GET',
        path: '/v1/search/nearbyProperties',
        handler: async (request, h) => {
            try {
                let data = await PropertyService.nearbyProperties(request.query);
                return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.UPDATED, data))
            }
            catch (error) {
                return (UniversalFunctions.sendError(error))
            }
        },
        options: {
            description: 'GET properties',
            tags: ['api', 'anonymous', 'user', 'update'],
            //  auth: "UserAuth",
            validate: {
                query: {
                    page: Joi.number(),
                    limit: Joi.number(),
                    searchTerm: Joi.string(),
                    type: Joi.string(),
                    label: Joi.array(),
                    maxPrice: Joi.number(),
                    minPrice: Joi.number(),
                    propertyType: Joi.number(),
                    bedrooms: Joi.number(),
                    bathrooms: Joi.number(),
                    minArea: Joi.number(),
                    maxArea: Joi.number(),
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
   * @description : active property of user by status
   */
    {
        method: 'GET',
        path: '/v1/user/status/property',
        handler: async (request, h) => {
            try {
                let userData = request.auth && request.auth.credentials && request.auth.credentials.userData;
                let payload = request.query;
                let data = await PropertyService.userPropertyByStatus(payload, userData);
                return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.DEFAULT, data))
            }
            catch (error) {
                return (UniversalFunctions.sendError(error))
            }
        },
        options: {
            description: 'GET properties by status',
            tags: ['api', 'anonymous', 'user', 'Property'],
            auth: "UserAuth",
            validate: {
                query: {
                    propertyType: Joi.string().valid([
                        Constant.DATABASE.PROPERTY_STATUS.ACTIVE,
                        Constant.DATABASE.PROPERTY_STATUS.DRAFT,
                        Constant.DATABASE.PROPERTY_STATUS.EXPIRED,
                        Constant.DATABASE.PROPERTY_STATUS.FEATURED,
                        Constant.DATABASE.PROPERTY_STATUS.PENDING,
                        Constant.DATABASE.PROPERTY_STATUS.SOLD,
                    ]),
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