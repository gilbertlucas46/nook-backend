import { ServerRoute, ResponseToolkit } from 'hapi';
import * as Joi from 'joi';
import * as UniversalFunctions from '@src/utils';
import * as Constant from '@src/constants/app.constant';
import { LoanController } from '@src/controllers';
import { LOAN_PROPERTY_TYPES, LOAN_PROPERTY_STATUS, EMPLOYMENT_TYPE, EMPLOYMENT_RANK } from '@src/constants';

export let loanRoute: ServerRoute[] = [
	{
		method: 'POST',
		path: '/v1/loan',
		handler: async (request, h: ResponseToolkit) => {
			try {
				const payload: any = request.payload;
				await LoanController.addLoanRequirements(payload);
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
					abbrevation: Joi.string().min(2).max(6).required(),
					bankName: Joi.string().min(3).max(80).required(),
					headquarterLocation: Joi.string().min(3).max(50).required(),
					propertySpecification: Joi.array().items({
						allowedPropertyType: Joi.string().valid([
							LOAN_PROPERTY_TYPES.APARTMENT.value,
							LOAN_PROPERTY_TYPES.CONDOMINIUM.value,
							LOAN_PROPERTY_TYPES.HOUSE_LOT.value,
							LOAN_PROPERTY_TYPES.TOWNHOUSE.value,
							LOAN_PROPERTY_TYPES.VACANT_LOT.value,
						]).required(),
						allowedPropertyStatus: Joi.array().items(Joi.string().valid([
							LOAN_PROPERTY_STATUS.FORECLOSED.value,
							LOAN_PROPERTY_STATUS.REFINANCING.value,
							LOAN_PROPERTY_STATUS.PRE_SELLING.value,
							LOAN_PROPERTY_STATUS.READY_FOR_OCCUPANCY.value,
							LOAN_PROPERTY_STATUS.RESELLING.value,
						])).required(),
						maxLoanDurationAllowed: Joi.number().max(30).required(),
						maxLoanPercent: Joi.number().min(3).max(80),
						debtIncomeRatio: Joi.number().min(0).max(100).required(),
					}).required(),
					interestRateDetails: Joi.object().required(),
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
					bankImageLogoUrl: Joi.string().allow(''),
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
						minEmploymentTenure: Joi.number(),
					}),
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
	{
		method: 'POST',
		path: '/v1/user/loan/application',
		handler: async (request, h: ResponseToolkit) => {
			try {
				const payload: any = request.payload;
				await LoanController.addLoanApplication(payload);
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
					userId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
					saveAsDraft: Joi.boolean().required(),
					personalInfo: Joi.object().keys({
						firstName: Joi.string().min(1).max(32).required(),
						lastName: Joi.string().min(1).max(32).required(),
						middleName: Joi.string().min(1).max(32).required(),
						gender: Joi.string().valid([
							Constant.DATABASE.GENDER.MALE,
							Constant.DATABASE.GENDER.FEMALE,
							Constant.DATABASE.GENDER.OTHER,
						]),
						educationBackground: Joi.string().valid([
							Constant.DATABASE.EDUCATION_BACKGROUND.POST_GRAD,
							Constant.DATABASE.EDUCATION_BACKGROUND.UNDER_GRAD,
							Constant.DATABASE.EDUCATION_BACKGROUND.COLLEGE,
							Constant.DATABASE.EDUCATION_BACKGROUND.VOCATIONAL,
						]),
						civilStatus: Joi.string().valid([
							Constant.DATABASE.CIVI_STATUS.SINGLE,
							Constant.DATABASE.CIVI_STATUS.WIDOW,
							Constant.DATABASE.CIVI_STATUS.SEPERATED,
							Constant.DATABASE.CIVI_STATUS.MARRIED,
						]),
						spouseFirstName: Joi.string().min(1).max(32),
						spouseMiddleName: Joi.string().min(1).max(32),
						spouseLastName: Joi.string().min(1).max(32),
						birthDate: Joi.date(),
						coBorrowerFirstName: Joi.string().min(1).max(32),
						coBorrowerMiddleName: Joi.string().min(1).max(32),
						coBorrowerLastName: Joi.string().min(1).max(32),
						relationship: Joi.string().valid([
							Constant.DATABASE.RELATIONSHIP.BROTHER,
							Constant.DATABASE.RELATIONSHIP.FATHER,
							Constant.DATABASE.RELATIONSHIP.MOTHER,
							Constant.DATABASE.RELATIONSHIP.SISTER,
							Constant.DATABASE.RELATIONSHIP.SPOUSE,
						]),
					}),
					contactInfo: Joi.object().keys({
						phoneNo: Joi.number().min(8).max(15),
						email: Joi.string(),
						mobileNo: Joi.number().min(8).max(15),
					}),
					property_address: Joi.object().keys({
						address: Joi.string().min(3).max(80),
						regionId: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
						cityId: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
						regionName: Joi.string().min(1).max(32),
						cityName: Joi.string().min(1).max(32),
						barangay: Joi.string().min(1).max(32),
						homeOwnership: Joi.string().valid([
							Constant.DATABASE.HOME_OWNERSHIP.LIVING_WITH_RELATIVE,
							Constant.DATABASE.HOME_OWNERSHIP.MORTGAGED,
							Constant.DATABASE.HOME_OWNERSHIP.OWNED,
							Constant.DATABASE.HOME_OWNERSHIP.RENTED,
							Constant.DATABASE.HOME_OWNERSHIP.USED_FREE,
						]),
					}),
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
];