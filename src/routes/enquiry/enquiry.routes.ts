'use strict';
import * as Joi from 'joi';
import * as UniversalFunctions from '@src/utils';
import * as Constant from '@src/constants/app.constant';
import { EnquiryService } from '@src/controllers';
import { EnquiryRequest } from '@src/interfaces/enquiry.interface';
import { ServerRoute } from 'hapi';

export let enquiryRoutes: ServerRoute[] = [
	{
		method: 'POST',
		path: '/v1/user/enquiry',
		handler: async (request, h) => {
			try {
				const userData = request.auth && request.auth.credentials && (request.auth.credentials as any).userData;
				const payload: EnquiryRequest.CreateEnquiry = request.payload as any;
				const registerResponse = await EnquiryService.createEnquiry(payload, userData);

				if (registerResponse === {}) {
					return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.ENQUIRY_SENT_AGENT, registerResponse));
				}
				return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.ENQUIRY_SENT, {}));
			} catch (error) {
				UniversalFunctions.consolelog(error, 'error', true);
				return (UniversalFunctions.sendError(error));
			}
		},
		options: {
			description: 'create Enquiry application',
			tags: ['api', 'anonymous', 'user', 'Enquiry'],
			auth: 'DoubleAuth',
			validate: {
				payload: {
					name: Joi.string().required(),
					email: Joi.string().email().required(),
					phoneNumber: Joi.string().required(),
					message: Joi.string().required(),
					propertyId: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
					// type: Joi.string().valid('Enquiry', 'Contact'),
					agentEmail: Joi.string().email(),
					agentId: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
					propertyOwnerId: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
					enquiryType: Joi.string().valid([
						Constant.DATABASE.ENQUIRY_TYPE.CONTACT,
						Constant.DATABASE.ENQUIRY_TYPE.PROPERTY,
					]).required(),
					propertyOwnerEmail: Joi.string().email(),
					// title: Joi.string(),
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
				const userData = request.auth && request.auth.credentials && (request.auth.credentials as any).userData;
				const payload: EnquiryRequest.GetEnquiry = request.query as any;
				const registerResponse = await EnquiryService.getEnquiryList(payload, userData);
				return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.DEFAULT, registerResponse));
			} catch (error) {
				UniversalFunctions.consolelog(error, 'error', true);
				return (UniversalFunctions.sendError(error));
			}
		},
		options: {
			description: 'create Enquiry application',
			tags: ['api', 'anonymous', 'user', 'Enquiry'],
			auth: 'UserAuth',
			validate: {
				query: {
					enquiryType: Joi.string().valid([
						Constant.DATABASE.ENQUIRY_TYPE.CONTACT,
						Constant.DATABASE.ENQUIRY_TYPE.PROPERTY,
					]),
					category: Joi.string().valid([
						Constant.DATABASE.ENQUIRY_CATEGORY.RECEIVED,
						Constant.DATABASE.ENQUIRY_CATEGORY.SENT,
					]),
					// agentId: Joi.string(),
					// getType: Joi.string().valid('sent'),
					page: Joi.number(),
					limit: Joi.number(),
					fromDate: Joi.number(),
					toDate: Joi.number(),
					searchTerm: Joi.string(),
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
		path: '/v1/user/enquiry/{enquiryId}',
		handler: async (request, h) => {
			try {
				// const userData = request.auth && request.auth.credentials && request.auth.credentials.userData;
				const payload: EnquiryRequest.GetInquiryById = request.params as any;
				const registerResponse = await EnquiryService.getEnquiryById(payload);
				return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.DEFAULT, registerResponse));
			} catch (error) {
				UniversalFunctions.consolelog(error, 'error', true);
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

	{
		method: 'GET',
		path: '/v1/admin/enquiry',
		handler: async (request, h) => {
			try {
				const adminData = request.auth && request.auth.credentials && (request.auth.credentials as any).adminData;
				const payload: EnquiryRequest.GetEnquiry = request.query as any;
				const registerResponse = await EnquiryService.getEnquiryList(payload, adminData);
				return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.DEFAULT, registerResponse));
			} catch (error) {
				UniversalFunctions.consolelog(error, 'error', true);
				return (UniversalFunctions.sendError(error));
			}
		},
		options: {
			description: 'create Enquiry application',
			tags: ['api', 'anonymous', 'user', 'Enquiry'],
			auth: 'AdminAuth',
			validate: {
				query: {
					enquiryType: Joi.string().valid([
						Constant.DATABASE.ENQUIRY_TYPE.PROPERTY,
					]),
					page: Joi.number(),
					limit: Joi.number(),
					fromDate: Joi.number(),
					toDate: Joi.number(),
					searchTerm: Joi.string(),
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