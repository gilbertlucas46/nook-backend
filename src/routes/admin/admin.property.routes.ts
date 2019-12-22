import { ServerRoute } from 'hapi';
import * as Joi from 'joi';
import * as UniversalFunctions from '../../utils';
import * as Constant from '../../constants';
import { PropertyService } from '../../controllers';
import { AdminRequest } from '@src/interfaces/admin.interface';

export let adminProperty: ServerRoute[] = [
    {
        method: 'POST',
        path: '/v1/admin/property',
        handler: async (request, h) => {
            try {
                const adminData = request.auth && request.auth.credentials && (request.auth.credentials as any).adminData;
                const payload = request.payload as AdminRequest.IaddProperty;
                // const checkPermission = adminData['permission'].some(data => {
                //     return data.moduleName === Constant.DATABASE.PERMISSION.TYPE.PROPERTIES;
                // });
                // if (!checkPermission) {
                //     return UniversalFunctions.sendError(Constant.STATUS_MSG.ERROR.E404);
                // }
                console.log('payloadpayloadpayloadpayloadpayload', payload);

                const responseData = await PropertyService.adminAddProperty(payload, adminData);
                // const registerResponse = await AdminUserController.addUser(payload);
                return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S201.CREATED, responseData));
            } catch (error) {
                UniversalFunctions.consolelog('error', error, true);
                return (UniversalFunctions.sendError(error));
            }
        },
        options: {
            description: 'admin add property',
            tags: ['api', 'anonymous', 'Admin', 'property'],
            auth: 'AdminAuth',
            validate: {
                payload: {
                    propertyId: Joi.string().regex(/^[0-9a-fA5-F]{24}$/),
                    subscriptionId: Joi.string().regex(/^[0-9a-fA5-F]{24}$/).optional(),
                    property_features: {
                        storeys_2: Joi.boolean().default(false),
                        security_24hr: Joi.boolean().default(false),
                        air_conditioning: Joi.boolean().default(false),
                        balcony: Joi.boolean().default(false),
                        basketball_court: Joi.boolean().default(false),
                        business_center: Joi.boolean().default(false),
                        carpark: Joi.boolean().default(false),
                        CCTV_monitoring: Joi.boolean().default(false),
                        child_playground: Joi.boolean().default(false),
                        clothes_dryer: Joi.boolean().default(false),
                        club_house: Joi.boolean().default(false),
                        day_care: Joi.boolean().default(false),
                        den: Joi.boolean().default(false),
                        fully_furnished: Joi.boolean().default(false),
                        function_Room: Joi.boolean().default(false),
                        garden: Joi.boolean().default(false),
                        gym: Joi.boolean().default(false),
                        laundry: Joi.boolean().default(false),
                        loft: Joi.boolean().default(false),
                        maids_room: Joi.boolean().default(false),
                        microwave: Joi.boolean().default(false),
                        parking: Joi.boolean().default(false),
                        pet_friendly: Joi.boolean().default(false),
                        refrigerator: Joi.boolean().default(false),
                        semi_furnished: Joi.boolean().default(false),
                        sky_deck: Joi.boolean().default(false),
                        spa: Joi.boolean().default(false),
                        swimming_pool: Joi.boolean().default(false),
                        tennis_court: Joi.boolean().default(false),
                        TV_cable: Joi.boolean().default(false),
                        unfurnished: Joi.boolean().default(false),
                        washing_machine: Joi.boolean().default(false),
                        wiFi: Joi.boolean().default(false),
                    },
                    property_details: {
                        floor_area: Joi.number(),
                        lot_area: Joi.number(),
                        bedrooms: Joi.number(),
                        bathrooms: Joi.number(),
                        garages: Joi.number(),
                        garage_size: Joi.number(),
                        buildYear: Joi.number(),
                    },
                    property_address: {
                        address: Joi.string().min(1).max(300).trim().required(),
                        regionId: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
                        cityId: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
                        regionName: Joi.string(),
                        cityName: Joi.string(),
                        barangay: Joi.string().min(1).max(100).trim(),
                        location: {
                            coordinates: Joi.array().ordered([
                                Joi.number().min(-180).max(180).required(),
                                Joi.number().min(-90).max(90).required(),
                            ]),
                        },
                    },
                    property_basic_details: {
                        title: Joi.string().min(1).max(60).trim().required(),
                        description: Joi.string().min(1).max(2000).trim().required(),
                        type: Joi.string().valid([
                            Constant.DATABASE.PROPERTY_TYPE.NONE,
                            Constant.DATABASE.PROPERTY_TYPE['APPARTMENT/CONDO'],
                            Constant.DATABASE.PROPERTY_TYPE.COMMERCIAL,
                            Constant.DATABASE.PROPERTY_TYPE.HOUSE_LOT,
                            Constant.DATABASE.PROPERTY_TYPE.LAND,
                            Constant.DATABASE.PROPERTY_TYPE.ROOM,
                        ]).required(),
                        property_for_number: Joi.number().valid([
                            Constant.DATABASE.PROPERTY_FOR.RENT.NUMBER,
                            Constant.DATABASE.PROPERTY_FOR.SALE.NUMBER,
                        ]).required(),
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
                        sale_rent_price: Joi.number().required(),
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
                    // userId: Joi.string().trim().regex(/^[0-9a-fA-F]{24}$/),
                    property_added_by: {
                        userName: Joi.string(),
                        phoneNumber: Joi.string(),
                        userId: Joi.string().trim().regex(/^[0-9a-fA-F]{24}$/),
                        profilePicUrl: Joi.string().allow(''),
                        firstName: Joi.string().allow(''),
                        lastName: Joi.string().allow(''),
                        email: Joi.string().email().lowercase().required(),
                        middleName: Joi.string(),
                        userType: Joi.string().valid([
                            Constant.DATABASE.USER_TYPE.AGENT.TYPE,
                            Constant.DATABASE.USER_TYPE.OWNER.TYPE,
                        ]),
                    },
                    isFeatured: Joi.boolean().default(false),
                    isHomePageFeatured: Joi.boolean().default(false),
                    propertyImages: Joi.array(),
                },
                headers: UniversalFunctions.authorizationHeaderObj,
                failAction: UniversalFunctions.failActionFunction,
            },
            plugins: {
                'hapi-swagger': {
                    responseMessages: Constant.swaggerDefaultResponseMessages,
                },
            },
        },
    },
];