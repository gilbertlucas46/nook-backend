import { ServerRoute, Request, ResponseToolkit } from 'hapi';
import * as Joi from 'joi';
import * as UniversalFunctions from '@src/utils';
import * as Constant from '@src/constants/app.constant';
import { PropertyService, LoanController } from '@src/controllers';
import { PropertyRequest } from '@src/interfaces/property.interface';
import { LOAN_PROPERTY_TYPES, LOAN_PROPERTY_STATUS, EMPLOYMENT_TYPE, EMPLOYMENT_RANK } from '@src/constants';

export let loanRoute: ServerRoute[] = [
	{
		method: 'POST',
		path: '/v1/loan',
		handler: async (request, h: ResponseToolkit) => {
			try {
				// const userData = request.auth && request.auth.credentials && (request.auth.credentials as any).userData;
				const payload: any = request.payload;
				const registerResponse = await LoanController.addLoanRequirements(payload);
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
					// userEmploymentCriteria: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
					// bankPayload: Joi.array().items({
						abbrevation: Joi.string().min(2).max(6).required(),
						bankName: Joi.string().min(3).max(80).required(),
						headquarterLocation: Joi.string().min(3).max(50).required(),
						propertySpecification: Joi.array().items({
							allowedPropertyType: Joi.string().valid([
								LOAN_PROPERTY_TYPES.APARTMENT.value,
								LOAN_PROPERTY_TYPES.CONDOMINIUM.value,
								LOAN_PROPERTY_TYPES.HOUSE_LOT.value,
								LOAN_PROPERTY_TYPES.TOWNHOUSE.value,
								LOAN_PROPERTY_TYPES.VACANT_LOT.value
							]).required(),
							allowedPropertyStatus: Joi.array().items(Joi.string().valid([
								LOAN_PROPERTY_STATUS.FORECLOSED.value,
								LOAN_PROPERTY_STATUS.REFINANCING.value,
								LOAN_PROPERTY_STATUS.PRE_SELLING.value,
								LOAN_PROPERTY_STATUS.READY_FOR_OCCUPANCY.value,
								LOAN_PROPERTY_STATUS.RESELLING.value
							])).required(),
							maxLoanDurationAllowed: Joi.number().max(30).required(),
							maxLoanPercent: Joi.number().min(3).max(80),
							debtIncomeRatio: Joi.number().min(0).max(100).required()
						}).required(),
						interestRateDetails: Joi.array().items({
							fixedPeriod: Joi.number().min(12).max(360).required(),
							interestRate: Joi.number().required()
						}).required(),
						bankFeePercent: Joi.number(),
						bankFeeAmount: Joi.number(),
						debtIncomeRatio: Joi.number().max(100),
						loanApplicationFeePercent: Joi.number(),
						loanMinAmount: Joi.number().required(),
						loanMaxAmount: Joi.number().required(),
						minLoanDuration: Joi.number().min(12).max(360),
						maxLoanDuration: Joi.number().max(360),
						loanForForeigner: Joi.boolean(),
						loanForForeignerMarriedLocal: Joi.boolean(),
						loanForNonCreditCardHolder: Joi.boolean(),
						loanForCreditCardHolder: Joi.boolean(),
						loanForNotNowCreditCardHolder: Joi.boolean(),
						minAgeRequiredForLoan: Joi.number().min(21).max(65),
						maxAgeRequiredForLoan: Joi.number().min(21).max(65),
						loanAlreadyExistDiffBank: Joi.boolean(),
						loanAlreadyExistSameBank: Joi.boolean(),
						minMonthlyIncomeLoan: Joi.number(),
						minMonthlyIncomeRequired: Joi.number(),
						missedLoanPaymentAllowance: Joi.boolean(),
						bankImageLogoUrl: Joi.string().allow(""),
						LoanForEmploymentType: Joi.array().items({
							employmentType: Joi.string().valid([
								EMPLOYMENT_TYPE.BPO.value,
								EMPLOYMENT_TYPE.GOVT.value,
								EMPLOYMENT_TYPE.OFW.value,
								EMPLOYMENT_TYPE.PRIVATE.value,
								EMPLOYMENT_TYPE.PROFESSIONAL.value,
								EMPLOYMENT_TYPE.SELF.value,
							]),
							employmentRank: Joi.array().items(Joi.string().valid([
								EMPLOYMENT_RANK.ASSISSTANT_VICE_PRESIDENT.value,
								EMPLOYMENT_RANK.ASSISTANT_MANAGER.value,
								EMPLOYMENT_RANK.CHAIRMAN.value,
								EMPLOYMENT_RANK.CHIEF_EXECUTIVE_OFFICER.value,
								EMPLOYMENT_RANK.CLERK.value,
								EMPLOYMENT_RANK.DIRECTOR.value,
								EMPLOYMENT_RANK.EXECUTIVE_VICE_PRESIDENT.value,
								EMPLOYMENT_RANK.FIRST_VICE_PRESIDENT.value,
								EMPLOYMENT_RANK.GENERAL_EMPLOYEE.value,
								EMPLOYMENT_RANK.MANAGER.value,
								EMPLOYMENT_RANK.NON_PROFESIONNAL.value,
								EMPLOYMENT_RANK.OWNER.value,
								EMPLOYMENT_RANK.PRESIDENT.value,
								EMPLOYMENT_RANK.PROFESSIONAL.value,
								EMPLOYMENT_RANK.RANK_FILE.value,
								EMPLOYMENT_RANK.SENIOR_ASSISTANT_MANAGER.value,
								EMPLOYMENT_RANK.SENIOR_ASSISTANT_VICE_PRESIDENT.value,
								EMPLOYMENT_RANK.SENIOR_MANAGER.value,
								EMPLOYMENT_RANK.SENIOR_VICE_PRESIDENT.value,
								EMPLOYMENT_RANK.SUPERVISOR.value,
								EMPLOYMENT_RANK.VICE_PRESIDENT.value,
							])),
							minEmploymentTenure: Joi.number()
						})
					// })

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