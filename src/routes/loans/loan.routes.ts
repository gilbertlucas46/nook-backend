import { ServerRoute, Request, ResponseToolkit } from 'hapi';
import * as Joi from 'joi';
import * as UniversalFunctions from '@src/utils';
import * as Constant from '@src/constants/app.constant';
import { PropertyService } from '@src/controllers';
import { PropertyRequest } from '@src/interfaces/property.interface';
import { LOAN_PROPERTY_TYPES, LOAN_PROPERTY_STATUS } from '@src/constants';

export let loanRoute: ServerRoute[] = [
	{
		method: 'POST',
		path: '/v1/loan',
		handler: async (request, h: ResponseToolkit) => {
			try {
				// const userData = request.auth && request.auth.credentials && (request.auth.credentials as any).userData;
				const payload: any = request.payload as any;
				// const registerResponse = await PropertyService.addLoanRequirements(payload);
				return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S201.CREATED, {}));
			} catch (error) {
				return (UniversalFunctions.sendError(error));
			}
		},
		options: {
			description: 'add Loan Requirements',
			tags: ['api', 'anonymous', 'loan', 'Add'],
			// auth: 'UserAuth',
			validate: {
				payload: {
					userEmploymentCriteria: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
					abbrevation: Joi.string().min(2).max(6).required(),
					bankName: Joi.string().min(3).max(32).required(),
					headquarters: Joi.string().min(3).max(50).required(),
					propertySpecification: Joi.array().items({
						allowedPropertyType: Joi.string().valid([
							LOAN_PROPERTY_TYPES.VACANT_LOT.value,
							LOAN_PROPERTY_TYPES.CONDOMINIUM.value,
							LOAN_PROPERTY_TYPES.HOUSE_LOT.value,
							LOAN_PROPERTY_TYPES.TOWNHOUSE.value,
							LOAN_PROPERTY_TYPES.VACANT_LOT.value
						]).required(),
						allowedPropertyStatus: Joi.string().valid([
							LOAN_PROPERTY_STATUS.FORECLOSED.value,
							LOAN_PROPERTY_STATUS.REFINANCING.value,
							LOAN_PROPERTY_STATUS.PRE_SELLING.value,
							LOAN_PROPERTY_STATUS.READY_FOR_OCCUPANCY.value,
							LOAN_PROPERTY_STATUS.RESELLING.value
						]).required(),
						maxLoanDurationAllowed: Joi.number().max(30).required()
					}).required(),
					interestRateDetails: Joi.array().items({
						fixedPeriod: Joi.number().min(1).max(3).required(),
						interestRate: Joi.number().required()
					}).required(),
					loanProcessingPercent: Joi.number()
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
]