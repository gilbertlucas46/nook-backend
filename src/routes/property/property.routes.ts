import { ServerRoute, Request, ResponseToolkit } from 'hapi';
import * as Joi from 'joi';
import * as UniversalFunctions from '@src/utils';
import * as Constant from '@src/constants/app.constant';
import { PropertyService } from '@src/controllers';
import { PropertyRequest } from '@src/interfaces/property.interface';

export let propertyRoute: ServerRoute[] = [
	/**
	 * @description: user add property
	 */
	{
		method: 'POST',
		path: '/v1/user/property',
		handler: async (request, h: ResponseToolkit) => {
			try {
				const userData = request.auth && request.auth.credentials && (request.auth.credentials as any).userData;
				const payload: PropertyRequest.PropertyData = request.payload as any;
				const registerResponse = await PropertyService.addProperty(payload, userData);
				return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S201.PROPERTY_ADDED, registerResponse));
			} catch (error) {
				return (UniversalFunctions.sendError(error));
			}
		},
		options: {
			description: 'Register Property',
			tags: ['api', 'anonymous', 'property', 'register'],
			auth: 'UserAuth',
			validate: {
				payload: {
					propertyId: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
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
					isFeatured: Joi.boolean().default(false),
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
	/**
	 * @description :Property List
	 */
	{
		method: 'GET',
		path: '/v1/user/propertyList',
		handler: async (request, h: ResponseToolkit) => {
			try {
				const payload: any = request.query;
				if (!payload.sortBy) {
					payload.sortBy = 'isFeatured';
					payload.sortType = -1;
				}
				payload['property_status'] = Constant.DATABASE.PROPERTY_STATUS.ACTIVE.NUMBER;
				const propertyList = await PropertyService.searchProperties(request.query);
				return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.UPDATED, propertyList));
			} catch (error) {
				return (UniversalFunctions.sendError(error));
			}
		},
		options: {
			description: 'GET properties',
			tags: ['api', 'anonymous', 'user', 'update'],
			auth: 'DoubleAuth',
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
					sortBy: Joi.number().valid([]),
					sortType: Joi.number().valid(Constant.ENUM.SORT_TYPE),
					fromDate: Joi.number(),
					toDate: Joi.number(),
					property_status: Joi.number().valid([
						Constant.DATABASE.PROPERTY_STATUS.ACTIVE.NUMBER,
					]),
					bedrooms: Joi.number(),
					bathrooms: Joi.number(),
					minArea: Joi.number(),
					maxArea: Joi.number(),
					propertyId: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
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
	/**
	 * @description : near by peoperty listing based on the radius
	 */
	{
		method: 'GET',
		path: '/v1/search/nearbyProperties',
		handler: async (request, h: ResponseToolkit) => {
			try {
				const payload: any = request.query;
				if (!payload.sortBy) {
					payload.sortBy = 'isFeatured';
					payload.sortType = -1;
				}
				payload['property_status'] = Constant.DATABASE.PROPERTY_STATUS.ACTIVE.NUMBER;
				const data = await PropertyService.nearbyProperties(payload);
				return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.UPDATED, data));
			} catch (error) {
				return (UniversalFunctions.sendError(error));
			}
		},
		options: {
			description: 'GET properties',
			tags: ['api', 'anonymous', 'user', 'update'],
			//  auth: 'UserAuth',
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
					sortBy: Joi.string().valid(['price', 'date', 'isFeatured']),
					sortType: Joi.number().valid([
						Constant.ENUM.SORT_TYPE,
					]),
					fromDate: Joi.number(),
					toDate: Joi.number(),
					property_status: Joi.number().valid([
						Constant.DATABASE.PROPERTY_STATUS.ACTIVE.NUMBER,
					]),
					propertyId: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
					property_features: Joi.array(),
				},
				failAction: UniversalFunctions.failActionFunction,
			},
			plugins: {
				'hapi-swagger': {
					responseMessages: Constant.swaggerDefaultResponseMessages,
				},
			},
		},
	},
	/**
	 * @description : active property of user by status
	 */
	{
		method: 'GET',
		path: '/v1/user/status/property',
		handler: async (request, h: ResponseToolkit) => {
			try {
				const userData = request.auth && request.auth.credentials && (request.auth.credentials as any).userData;
				const payload = request.query;
				const data = await PropertyService.userPropertyByStatus(payload, userData);
				return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.DEFAULT, data));
			} catch (error) {
				return (UniversalFunctions.sendError(error));
			}
		},
		options: {
			description: 'GET properties by status',
			tags: ['api', 'anonymous', 'user', 'Property'],
			auth: 'UserAuth',
			validate: {
				query: {
					propertyType: Joi.number().valid([
						Constant.DATABASE.PROPERTY_STATUS.ACTIVE.NUMBER,
						Constant.DATABASE.PROPERTY_STATUS.DRAFT.NUMBER,
						Constant.DATABASE.PROPERTY_STATUS.EXPIRED.NUMBER,
						Constant.DATABASE.PROPERTY_STATUS.PENDING.NUMBER,
						Constant.DATABASE.PROPERTY_STATUS.SOLD_RENTED.NUMBER,
						Constant.DATABASE.PROPERTY_ACTIONS.ISFEATURED.NUMBER,
					]),
					page: Joi.number(),
					limit: Joi.number(),
					sortType: Joi.number().valid([
						Constant.ENUM.SORT_TYPE,
					]),
					sortBy: Joi.string().valid(['price', 'date', 'isFeatured']),
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
	/**
	 * @description
	 */
	{
		method: 'POST',
		path: '/v1/user/save-as-draft',
		handler: async (request, h: ResponseToolkit) => {
			try {
				const userData = request.auth && request.auth.credentials && (request.auth.credentials as any).userData;
				const payload: PropertyRequest.PropertyData = request.payload as any;
				const registerResponse = await PropertyService.saveAsDraft(payload, userData);
				return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S201.PROPERTY_SAVE_AS_DRAFT, registerResponse));
			} catch (error) {
				return (UniversalFunctions.sendError(error));
			}
		},
		options: {
			description: 'propert save into draft',
			tags: ['api', 'anonymous', 'property', 'draft'],
			auth: 'UserAuth',
			validate: {
				payload: {
					propertyId: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
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
						title: Joi.string().min(1).max(60).trim(),
						description: Joi.string().min(1).max(2000).trim(),
						type: Joi.string().valid([
							Constant.DATABASE.PROPERTY_TYPE.NONE,
							Constant.DATABASE.PROPERTY_TYPE['APPARTMENT/CONDO'],
							Constant.DATABASE.PROPERTY_TYPE.COMMERCIAL,
							Constant.DATABASE.PROPERTY_TYPE.HOUSE_LOT,
							Constant.DATABASE.PROPERTY_TYPE.LAND,
							Constant.DATABASE.PROPERTY_TYPE.ROOM,
						]),
						property_for_number: Joi.number().valid([
							Constant.DATABASE.PROPERTY_FOR.RENT.NUMBER,
							Constant.DATABASE.PROPERTY_FOR.SALE.NUMBER,
						]),
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
					isFeatured: Joi.boolean().default(false),
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

	/**
	 * @description : active property of user by status
	 */
	{
		method: 'PATCH',
		path: '/v1/properties/{propertyId}/status',
		handler: async (request, h: ResponseToolkit) => {
			try {
				const userData = request.auth && request.auth.credentials && (request.auth.credentials as any).userData;
				const payload = {
					propertyId: request.params.propertyId,
					status: (request.payload as any).property_status,
					upgradeToFeature: (request.payload as any).upgradeToFeature,
				};

				const data = await PropertyService.updatePropertyStatus(payload, userData);
				return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.DEFAULT, data));
			} catch (error) {
				return (UniversalFunctions.sendError(error));
			}
		},
		options: {
			description: 'GET properties by status',
			tags: ['api', 'anonymous', 'user', 'Property'],
			auth: 'UserAuth',
			validate: {
				params: {
					propertyId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
				},
				payload: {
					property_status:
						Joi.number().valid([
							Constant.DATABASE.PROPERTY_STATUS.SOLD_RENTED.NUMBER,
							Constant.DATABASE.PROPERTY_STATUS.PENDING.NUMBER,
						]),
					upgradeToFeature: Joi.boolean(),
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