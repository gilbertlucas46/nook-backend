"use strict";
import * as Joi from 'joi';
import * as UniversalFunctions from '../../utils';
import * as Constant from '../../constants/app.constant'
import { PropertyService } from '../../controllers'


export let propertyRoute = [
    {
        method: 'POST',
        path: '/v1/user/property',
        handler: async (request, h) => {
            try {
                let userData = request.auth && request.auth.credentials && request.auth.credentials.userData;
                let payload: PropertyRequest.PropertyData = request.payload;
                console.log(`This request is on ${request.path} with parameters ${JSON.stringify(payload)}`)

                if (payload.propertyId) {
                    let registerResponse = await PropertyService.addProperty(payload, userData);
                    return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.UPDATED, registerResponse))

                } else {
                    let registerResponse = await PropertyService.addProperty(payload, userData);
                    return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S201.CREATED, registerResponse))

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
                        floor_area: Joi.string().min(1).max(20).trim(),
                        floor_area_unit: Joi.string().min(1).max(20).trim(),
                        // land_area: Joi.number(),
                        // land_area_unit: Joi.string().min(1).max(20).trim(),
                        lot_area: Joi.string().valid(["m2", "sqm"]),
                        bedrooms: Joi.number(),
                        bathrooms: Joi.number(),
                        garages: Joi.number(),
                        garage_size: Joi.string().valid(["m2", "sqm"]),
                        buildYear: Joi.number()
                    },
                    property_address: {
                        address: Joi.string().min(1).max(20).trim().required(),
                        region: Joi.string().min(1).max(20).trim().required(),
                        city: Joi.string().min(1).max(20).trim().required(),
                        Barangay: Joi.string().min(1).max(20).trim(),
                        location: {
                            type: Joi.array().required(),  // need to change
                            coordinates: Joi.number()
                        }
                    },

                    property_basic_details: {
                        title: Joi.string().min(1).max(20).trim().required(),
                        description: Joi.string().min(1).max(20).trim().required(),
                        type: Joi.string().valid([
                            Constant.DATABASE.PROPERTY_TYPE.NONE,
                            Constant.DATABASE.PROPERTY_TYPE["APPARTMENT/CONDO"],
                            Constant.DATABASE.PROPERTY_TYPE.COMMERCIAL,
                            Constant.DATABASE.PROPERTY_TYPE.HOUSE_LOT,
                            Constant.DATABASE.PROPERTY_TYPE.LAND,
                            Constant.DATABASE.PROPERTY_TYPE.ROOM,
                        ]),
                        //  Joi.string().min(1).max(20).trim().required(),
                        status: Joi.string().min(1).max(20).trim().required(),
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
    },
]