'use strict';
import * as Joi from 'joi';
import * as UniversalFunctions from '@src/utils';
import * as Constant from '@src/constants/app.constant';
import { EnquiryService } from '@src/controllers';
import { EnquiryRequest } from '@src/interfaces/enquiry.interface';

export let enquiryRoutes = [
	{
		method: 'POST',
		path: '/v1/user/unauth/enquiry',
		handler: async (request, h) => {
			try {
				const payload: EnquiryRequest.CreateEnquiry = request.payload;
				const registerResponse = await EnquiryService.createEnquiry(payload);
				return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S201.ENQUIRY_SUBMITTED, registerResponse));
			} catch (error) {
				UniversalFunctions.consolelog('error', error, true);
				return (UniversalFunctions.sendError(error));
			}
		},
		options: {
			description: 'create Enquiry application',
			tags: ['api', 'anonymous', 'user', 'Enquiry'],
			// auth: 'BasicAuth',
			validate: {
				payload: {
					name: Joi.string().required(),
					email: Joi.string().email().required(),
					phoneNumber: Joi.string().required(),
					message: Joi.string().required(),
					propertyId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
				},
				// headers: UniversalFunctions.authorizationHeaderObj,
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
	 *
	 */
	{
		method: 'POST',
		path: '/v1/user/enquiry',
		handler: async (request, h) => {
			try {
				const payload: EnquiryRequest.CreateEnquiry = request.payload;
				const registerResponse = await EnquiryService.createAuthEnquiry(payload);
				return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.DEFAULT, registerResponse));
			} catch (error) {
				return (UniversalFunctions.sendError(error));
			}
		},
		options: {
			description: 'create Enquiry application',
			tags: ['api', 'anonymous', 'user', 'Enquiry'],
			auth: 'UserAuth',
			validate: {
				payload: {
					name: Joi.string().required(),
					email: Joi.string().email(),
					phoneNumber: Joi.string().required(),
					message: Joi.string().required(),
					propertyId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
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

	{
		method: 'GET',
		path: '/v1/user/enquiry',
		handler: async (request, h) => {
			try {
				const userData = request.auth && request.auth.credentials && request.auth.credentials.userData;
				const payload: EnquiryRequest.GetEnquiry = request.query;
				const registerResponse = await EnquiryService.getEnquiryList(payload, userData);
				return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.DEFAULT, registerResponse));
			} catch (error) {
				return (UniversalFunctions.sendError(error));
			}
		},
		options: {
			description: 'create Enquiry application',
			tags: ['api', 'anonymous', 'user', 'Enquiry'],
			auth: 'UserAuth',
			validate: {
				query: {
					fromDate: Joi.number(),
					toDate: Joi.number(),
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
	 * @description : ''
	 */

	{
		method: 'GET',
		path: '/v1/user/enquiry/{enquiryId}',
		handler: async (request, h) => {
			try {
				const userData = request.auth && request.auth.credentials && request.auth.credentials.userData;
				const payload: EnquiryRequest.GetInquiryById = request.params;

				const registerResponse = await EnquiryService.getEnquiryById(payload);
				return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.DEFAULT, registerResponse));
			} catch (error) {
				return (UniversalFunctions.sendError(error));
			}
		},
		options: {
			description: 'create Enquiry application',
			tags: ['api', 'anonymous', 'user', 'Enquiry'],
			auth: 'UserAuth',
			validate: {
				params: {
					enquiryId: Joi.string().required(),
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
