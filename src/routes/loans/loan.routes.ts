import { Database } from './../../databases/index';
import { LOAN_TYPES } from './../../constants/loan.constant';
import { ServerRoute, ResponseToolkit } from 'hapi';
import * as Joi from 'joi';
import * as UniversalFunctions from '@src/utils';
import * as Constant from '@src/constants/app.constant';
import { LoanController } from '@src/controllers';
import { LOAN_PROPERTY_TYPES, LOAN_PROPERTY_STATUS, EMPLOYMENT_TYPE, EMPLOYMENT_RANK, EMPLOYMENT_TENURE, INDUSTRIES, TRADE_REFERENCE } from '@src/constants';
import { LoanRequest } from '@src/interfaces/loan.interface';
import * as LoanConstant from '../../constants/loan.constant';

const objectSchema = Joi.object({
	// moduleName: Joi.string().min(1).valid([
	// 	status
	// 	// Constant.DATABASE.PERMISSION.TYPE.ENQUIRY,
	// ]).required(),
	// status: Joi.string().when('url', {
	// 	is: Joi.exist().valid(Joi.string().uri()),
	// 	then: Joi.string().valid([
	// 		LoanConstant.DocumentStatus.APPROVED,
	// 	]),
	// 	// else: Joi.string()
	// }),
	status: Joi.string().valid([
		LoanConstant.DocumentStatus.APPROVED,
		LoanConstant.DocumentStatus.PENDING,
		LoanConstant.DocumentStatus.REJECTED,
	]),
	url: Joi.string(),
	documentRequired: Joi.string().allow('').allow(null),
	description: Joi.string().allow('').allow(null),
	createdAt: Joi.number(),
});
export let loanRoute: ServerRoute[] = [
	{
		method: 'POST',
		path: '/v1/user/loan/application',
		handler: async (request, h: ResponseToolkit) => {
			try {
				const userData = request.auth && request.auth.credentials && (request.auth.credentials as any).userData;
				const payload: LoanRequest.AddLoan = request.payload as any;
				const data = await LoanController.addLoanApplication(payload, userData);
				return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S201.CREATED, data));
			} catch (error) {
				UniversalFunctions.consolelog(error, 'error', true);
				return (UniversalFunctions.sendError(error));
			}
		},
		options: {
			description: 'add Loan Requirements',
			tags: ['api', 'anonymous', 'loan', 'Add'],
			auth: 'UserAuth',
			validate: {
				payload: {
					ipAddress: Joi.string(),
					prequialificationId: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
					partnerName: Joi.string().allow(''),
					partnerId: Joi.string().allow(''),
					personalInfo: Joi.object().keys({
						firstName: Joi.string().min(1).max(32).required(),
						lastName: Joi.string().min(1).max(32),
						middleName: Joi.string().max(32).allow(''),
						monthlyIncome: Joi.number(),
						otherIncome: Joi.number(),
						motherMaidenName: Joi.string(),
						birthDate: Joi.string(),
						placeOfBirth: Joi.string(),
						nationality: Joi.string(),
						localVisa: Joi.boolean(),
						creditCard: Joi.object({
							status: Joi.string(),
							limit: Joi.number(),
							cancelled: Joi.boolean(),
						}),
						prevLoans: Joi.object({
							status: Joi.boolean(),
							monthlyTotal: Joi.number(),
							remainingTotal: Joi.number(),
						}),
						gender: Joi.string().valid([
							LoanConstant.GENDER.MALE.value,
							LoanConstant.GENDER.FEMALE.value,
							LoanConstant.GENDER.OTHER.value,
						]),
						educationBackground: Joi.string().valid([
							Constant.DATABASE.EDUCATION_BACKGROUND.POST_GRAD,
							Constant.DATABASE.EDUCATION_BACKGROUND.UNDER_GRAD,
							Constant.DATABASE.EDUCATION_BACKGROUND.COLLEGE,
							Constant.DATABASE.EDUCATION_BACKGROUND.VOCATIONAL,
						]),
						civilStatus: Joi.string().valid([
							Constant.DATABASE.CIVIL_STATUS.SINGLE,
							Constant.DATABASE.CIVIL_STATUS.WIDOW,
							Constant.DATABASE.CIVIL_STATUS.SEPERATED,
							Constant.DATABASE.CIVIL_STATUS.MARRIED,
						]),
						spouseInfo: {
							firstName: Joi.string().max(32),
							lastName: Joi.string().max(32),
							middleName: Joi.string().max(32),
							birthDate: Joi.string(),
							monthlyIncome: Joi.number(),
							isCoborrower: Joi.boolean(),
							motherMaidenName: Joi.string(),
							age: Joi.number(),
							birthPlace: Joi.string(),
						},
						coBorrowerInfo: {
							firstName: Joi.string().max(32),
							lastName: Joi.string().max(32),
							middleName: Joi.string().max(32),
							birthDate: Joi.string(),
							monthlyIncome: Joi.number(),
							isCoborrower: Joi.boolean(),
							relationship: Joi.string().valid([
								Constant.DATABASE.RELATIONSHIP.BROTHER,
								Constant.DATABASE.RELATIONSHIP.FATHER,
								Constant.DATABASE.RELATIONSHIP.MOTHER,
								Constant.DATABASE.RELATIONSHIP.SISTER,
								Constant.DATABASE.RELATIONSHIP.SPOUSE,
								Constant.DATABASE.RELATIONSHIP.SON,
								Constant.DATABASE.RELATIONSHIP.DAUGHTER,
								Constant.DATABASE.RELATIONSHIP.FIANCE,
								Constant.DATABASE.RELATIONSHIP.LIFE_DOMESTIC_PARTNER
							]),
							age: Joi.number(),
							birthPlace: Joi.string(),
							motherMaidenName: Joi.string(),
						},
					}),

					propertyInfo: {
						value: Joi.number(),
						type: Joi.string(),
						status: Joi.string(),
						developer: Joi.string(),
					},

					applicationStatus: Joi.string().valid([
						Constant.DATABASE.LOAN_APPLICATION_STATUS.DRAFT.value,
						Constant.DATABASE.LOAN_APPLICATION_STATUS.NEW.value,
					]).default(Constant.DATABASE.LOAN_APPLICATION_STATUS.NEW.value),
					bankInfo: Joi.object().keys({
						path:Joi.string(),
						iconUrl: Joi.string(),
						bankId: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
						bankName: Joi.string().min(5).max(50),
						abbrevation: Joi.string().max(10),
					}),

					contactInfo: Joi.object().keys({
						phoneNumber: Joi.string(),
						email: Joi.string().email(),
						mobileNumber: Joi.string().min(7).max(15),
						currentAddress: Joi.object().keys({
							address: Joi.string().max(300).required().trim(),
							homeOwnership: Joi.string().valid([
								Constant.DATABASE.HOME_OWNERSHIP.LIVING_WITH_RELATIVE,
								Constant.DATABASE.HOME_OWNERSHIP.MORTGAGED,
								Constant.DATABASE.HOME_OWNERSHIP.OWNED,
								Constant.DATABASE.HOME_OWNERSHIP.RENTED,
								Constant.DATABASE.HOME_OWNERSHIP.USED_FREE,
							]).required(),
							permanentResidenceSince: Joi.number().required(),
						}),
						permanentAddress: Joi.object().keys({
							address: Joi.string().max(300).required(),
							homeOwnership: Joi.string().valid([
								Constant.DATABASE.HOME_OWNERSHIP.LIVING_WITH_RELATIVE,
								Constant.DATABASE.HOME_OWNERSHIP.MORTGAGED,
								Constant.DATABASE.HOME_OWNERSHIP.OWNED,
								Constant.DATABASE.HOME_OWNERSHIP.RENTED,
								Constant.DATABASE.HOME_OWNERSHIP.USED_FREE,
							]).required(),
							permanentResidenceSince: Joi.number().required(),
						}),
						previousAddress: Joi.object().keys({
							address: Joi.string().max(300).required().trim(),
							homeOwnership: Joi.string().valid([
								Constant.DATABASE.HOME_OWNERSHIP.LIVING_WITH_RELATIVE,
								Constant.DATABASE.HOME_OWNERSHIP.MORTGAGED,
								Constant.DATABASE.HOME_OWNERSHIP.OWNED,
								Constant.DATABASE.HOME_OWNERSHIP.RENTED,
								Constant.DATABASE.HOME_OWNERSHIP.USED_FREE,
							]).required(),
							permanentResidenceSince: Joi.number().required(),
						}),
					}),
					loanDetails: Joi.object().keys({
						maxLoanTerm: Joi.number(),
						fixedPeriod: Joi.number(),
						loanTerm: Joi.number(),
						rate: Joi.number().max(100),
						monthlyRepayment: Joi.number(),
						hasCoBorrower: Joi.boolean(),
						loanType: Joi.string().valid([
							LoanConstant.LOAN_TYPES.CONSTRUCTION.value,
							LoanConstant.LOAN_TYPES.LOAN_TAKE_OUT.value,
							LoanConstant.LOAN_TYPES.PURCHASE_OF_PROPERTY.value,
							// LoanConstant.LOAN_TYPES.REFINANCING_LOAN.value,
							LoanConstant.LOAN_TYPES.REFINANCING.value,
							LoanConstant.LOAN_TYPES.RENOVATION.value,
							LoanConstant.LOAN_TYPES.HOME_EQUITY.value,
							LoanConstant.LOAN_TYPES.REIMBURSEMENT_LOAN.value
							// LoanConstant.LOAN_TYPES.NEW_CONSTRUCTION.value,

						]),
						loanPercent: Joi.number(),
						loanAmount: Joi.number(),
					}),
					loanAttorneyInfo:{
						name:Joi.string().allow(''),
						contactNumber: Joi.number().allow(''),
						address: Joi.string().max(300).allow(''),
						relationship: Joi.string().valid([
							Constant.DATABASE.RELATIONSHIP.BROTHER,
							Constant.DATABASE.RELATIONSHIP.FATHER,
							Constant.DATABASE.RELATIONSHIP.MOTHER,
							Constant.DATABASE.RELATIONSHIP.SISTER,
							Constant.DATABASE.RELATIONSHIP.SPOUSE,
							Constant.DATABASE.RELATIONSHIP.SON,
							Constant.DATABASE.RELATIONSHIP.DAUGHTER,
							Constant.DATABASE.RELATIONSHIP.FIANCE,
							Constant.DATABASE.RELATIONSHIP.LIFE_DOMESTIC_PARTNER
						]).allow(''),


					},

					employmentInfo: Joi.object().keys({
						type: Joi.string().valid([
							EMPLOYMENT_TYPE.BPO.value,
							EMPLOYMENT_TYPE.GOVT.value,
							EMPLOYMENT_TYPE.OFW.value,
							EMPLOYMENT_TYPE.PRIVATE.value,
							EMPLOYMENT_TYPE.PROFESSIONAL.value,
							EMPLOYMENT_TYPE.SELF.value,
							EMPLOYMENT_TYPE.COMMISSION_BASED.value,
							EMPLOYMENT_TYPE.FOREIGN_NATIONALS.value,
							EMPLOYMENT_TYPE.FREELANCER.value
						]),
						rank: Joi.string().valid([
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
						]),
						tenure: Joi.string(),
						tin: Joi.string(),
						companyName: Joi.string().min(1).max(300),
						sss: Joi.string(),
						officePhone: Joi.string(),
						officeEmail: Joi.string(),
						officeAddress: Joi.string().max(300),
						companyIndustry: Joi.string().valid([
							INDUSTRIES.AGRI_FOREST_FISH.value,
							INDUSTRIES.ADVERTISING.value,
							INDUSTRIES.BUSINESS_INFORMATION.value,
							INDUSTRIES.CONST_UTIL_CONTRACT.value,
							INDUSTRIES.EDUCATION.value,
							INDUSTRIES.ENTERTAINMENT_FASHION.value,
							INDUSTRIES.FINANCE_INSURANCE.value,
							INDUSTRIES.FOOD_HOSPITALITY.value,
							INDUSTRIES.GAMING.value,
							INDUSTRIES.HEALTH_SERVICES.value,
							INDUSTRIES.INFORMATION_TECHNOLOGY.value,
							INDUSTRIES.MANUFACTURING.value,
							INDUSTRIES.MOTOR_VEHICLE.value,
							INDUSTRIES.MUSIC_MEDIA.value,
							INDUSTRIES.NATURAL_RES_ENV.value,
							INDUSTRIES.OTHER.value,
							INDUSTRIES.PERSONAL_SERVICES.value,
							INDUSTRIES.REAL_ESTATE_HOUSING.value,
							INDUSTRIES.RETAIL.value,
							INDUSTRIES.SAFETY_SECURITY_LEGAL.value,
							INDUSTRIES.TRANSPORTATION.value,
						]),
						coBorrowerInfo: {
							employmentType: Joi.string().valid([
								EMPLOYMENT_TYPE.BPO.value,
								EMPLOYMENT_TYPE.GOVT.value,
								EMPLOYMENT_TYPE.OFW.value,
								EMPLOYMENT_TYPE.PRIVATE.value,
								EMPLOYMENT_TYPE.PROFESSIONAL.value,
								EMPLOYMENT_TYPE.SELF.value,
								EMPLOYMENT_TYPE.COMMISSION_BASED.value,
								EMPLOYMENT_TYPE.FOREIGN_NATIONALS.value,
								EMPLOYMENT_TYPE.FREELANCER.value
							]),
							tin: Joi.string(),
							companyName: Joi.string(),
							sss: Joi.string(),
							employmentRank: Joi.string().valid([
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
							]),
							employmentTenure: Joi.string().valid(Object.keys(EMPLOYMENT_TENURE)),
							companyIndustry: Joi.string().valid([
								INDUSTRIES.AGRI_FOREST_FISH.value,
								INDUSTRIES.ADVERTISING.value,
								INDUSTRIES.BUSINESS_INFORMATION.value,
								INDUSTRIES.CONST_UTIL_CONTRACT.value,
								INDUSTRIES.EDUCATION.value,
								INDUSTRIES.ENTERTAINMENT_FASHION.value,
								INDUSTRIES.FINANCE_INSURANCE.value,
								INDUSTRIES.FOOD_HOSPITALITY.value,
								INDUSTRIES.GAMING.value,
								INDUSTRIES.HEALTH_SERVICES.value,
								INDUSTRIES.INFORMATION_TECHNOLOGY.value,
								INDUSTRIES.MANUFACTURING.value,
								INDUSTRIES.MOTOR_VEHICLE.value,
								INDUSTRIES.MUSIC_MEDIA.value,
								INDUSTRIES.NATURAL_RES_ENV.value,
								INDUSTRIES.OTHER.value,
								INDUSTRIES.PERSONAL_SERVICES.value,
								INDUSTRIES.REAL_ESTATE_HOUSING.value,
								INDUSTRIES.RETAIL.value,
								INDUSTRIES.SAFETY_SECURITY_LEGAL.value,
								INDUSTRIES.TRANSPORTATION.value,
							]),
							officePhone: Joi.number(),
							officeEmail: Joi.string().email(),
							officeAddress: Joi.string().max(300),
						},
					}),
					dependentsInfo: Joi.array().items({
						name: Joi.string(),
						age: Joi.number(),
						relationship: Joi.string().valid([
							Constant.DATABASE.RELATIONSHIP.BROTHER,
							Constant.DATABASE.RELATIONSHIP.FATHER,
							Constant.DATABASE.RELATIONSHIP.MOTHER,
							Constant.DATABASE.RELATIONSHIP.SISTER,
							Constant.DATABASE.RELATIONSHIP.SPOUSE,
							Constant.DATABASE.RELATIONSHIP.SON,
							Constant.DATABASE.RELATIONSHIP.DAUGHTER,
							Constant.DATABASE.RELATIONSHIP.FIANCE,
							Constant.DATABASE.RELATIONSHIP.LIFE_DOMESTIC_PARTNER
						]),
					}),

					tradeReferences: Joi.array().items({
						companyName: Joi.string(),
						type: Joi.string().valid([
							TRADE_REFERENCE.CUSTOMER,
							TRADE_REFERENCE.SUPPLIER,
						]),
						contactPerson: Joi.string(),
						contactNumber: Joi.string(),
						position: Joi.string(),
					}),

					// propertyDocuments: Joi.object().keys({
					// 	borrowerValidDocIds: Joi.array().items(Joi.string()),
					// 	coBorrowerValidId: Joi.array().items(Joi.string()),
					// 	latestITR: Joi.string().uri(),
					// 	employmentCert: Joi.string().uri(),
					// 	purchasePropertyInfo: Joi.object().keys({
					// 		address: Joi.string().max(300),
					// 		contactPerson: Joi.string(),
					// 		contactNumber: Joi.number(),
					// 		collateralDocStatus: Joi.boolean(),
					// 		collateralDocList: Joi.array().items({
					// 			docType: Joi.string().valid([
					// 				Constant.DATABASE.COLLATERAL.DOC.TYPE.RESERVE_AGREEMENT,
					// 				Constant.DATABASE.COLLATERAL.DOC.TYPE.TAX_DECLARATION_1,
					// 				Constant.DATABASE.COLLATERAL.DOC.TYPE.TAX_DECLARATION_2,
					// 				Constant.DATABASE.COLLATERAL.DOC.TYPE.BILL_MATERIAL,
					// 				Constant.DATABASE.COLLATERAL.DOC.TYPE.FLOOR_PLAN,
					// 			]),
					// 			docUrl: Joi.string(),
					// 		}),
					// 	}),
					// 	nookAgent: Joi.string(),
					// }),

					documents: {
						purchasePropertyInfo: Joi.object().keys({
							address: Joi.string().max(300).required(),
							contactPerson: Joi.string().required(),
							contactNumber: Joi.string().required(),
						}),
						legalDocument: Joi.array().items({
							status: Joi.string().valid([
								LoanConstant.DocumentStatus.PENDING,
							]),
							url: Joi.string().uri().allow(''),
							documentRequired: Joi.string().allow('').allow(null),
							description: Joi.string().allow('').allow(null),
							createdAt: Joi.number(),
						}),
						incomeDocument: Joi.array().items({
							status: Joi.string().valid([
								LoanConstant.DocumentStatus.PENDING,
							]),
							url: Joi.string().uri().allow(''),
							documentRequired: Joi.string().allow('').allow(null),
							description: Joi.string().allow('').allow(null),
							createdAt: Joi.number(),
						}),
						colleteralDoc: Joi.array().items({
							status: Joi.string().valid([
								LoanConstant.DocumentStatus.PENDING,
							]),
							url: Joi.string().uri().allow(''),
							documentRequired: Joi.string().allow('').allow(null),
							description: Joi.string().allow('').allow(null),
							createdAt: Joi.number(),
						}),
					},
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
	 * @description: user loan for user loan-section
	 *
	 */
	{
		method: 'GET',
		path: '/v1/user/loan',
		handler: async (request, h) => {
			try {
				const userData = request.auth && request.auth.credentials && (request.auth.credentials as any).userData;
				const payload: LoanRequest.IGetUserLoanList = request.query as any;
				const data = await LoanController.userLoansList(payload, userData);
				return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.DEFAULT, data));
			} catch (error) {
				UniversalFunctions.consolelog('error', error, true);
				return (UniversalFunctions.sendError(error));
			}
		},
		options: {
			description: 'get user loan applications',
			tags: ['api', 'anonymous', 'user', 'user', 'loan'],
			auth: 'UserAuth',
			validate: {
				query: {
					limit: Joi.number(),
					page: Joi.number(),
					sortType: Joi.number().valid([Constant.ENUM.SORT_TYPE]),
					sortBy: Joi.string().default('date'),
					fromDate: Joi.number(),
					toDate: Joi.number(),
					status: Joi.string(),
					partnerId: Joi.string(),
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
	 * @description: user loan by id
	 */
	{
		method: 'GET',
		path: '/v1/user/loan/{loanId}',
		handler: async (request, h: ResponseToolkit) => {
			try {
				const userData = request.auth && request.auth.credentials && (request.auth.credentials as any).userData;
				const payload: LoanRequest.LoanById = request.params as any;
				const data = await LoanController.loanById(payload, userData);
				return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.DEFAULT, data));
			} catch (error) {
				UniversalFunctions.consolelog('error', error, true);
				return (UniversalFunctions.sendError(error));
			}
		},
		options: {
			description: 'get loan by id',
			tags: ['api', 'anonymous', 'user', 'user', 'Article'],
			auth: 'UserAuth',
			validate: {
				params: {
					loanId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
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
	 * @description: user update loan aplication
	 */
	{
		method: 'PATCH',
		path: '/v1/user/loan/application',
		handler: async (request, h: ResponseToolkit) => {
			try {

				const userData = request.auth && request.auth.credentials && (request.auth.credentials as any).userData;
				const payload: LoanRequest.AddLoan = request.payload as any;
				console.log("payload======...",JSON.stringify(payload))
				const data = await LoanController.updateLoanApplication(payload, userData);
				return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.DEFAULT, data));
			} catch (error) {
				UniversalFunctions.consolelog('error', error, true);
				return (UniversalFunctions.sendError(error));
			}
		},
		options: {
			description: 'update loan by id',
			tags: ['api', 'anonymous', 'user', 'user', 'Article'],
			auth: 'UserAuth',
			validate: {
				payload: {
					ipAddress: Joi.string(),
					loanId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
					partnerName: Joi.string().allow(''),
					partnerId: Joi.string().allow(''),
					// saveAsDraft: Joi.boolean().required(),
					applicationStatus: Joi.string().valid([
						Constant.DATABASE.LOAN_APPLICATION_STATUS.APPLICATION_WITHDRAWN.value,
						Constant.DATABASE.LOAN_APPLICATION_STATUS.APPROVED_AWAITING_CLIENT.value,
						Constant.DATABASE.LOAN_APPLICATION_STATUS.ARCHIVE.value,
						Constant.DATABASE.LOAN_APPLICATION_STATUS.AWAITING_PROPERTY_CONSTRUCTION.value,
						Constant.DATABASE.LOAN_APPLICATION_STATUS.AWAITING_SELLER_DEVELOPER.value,
						Constant.DATABASE.LOAN_APPLICATION_STATUS.BANK_APPROVED.value,
						Constant.DATABASE.LOAN_APPLICATION_STATUS.BANK_DECLINED.value,
						Constant.DATABASE.LOAN_APPLICATION_STATUS.CREDIT_ASSESSMENT.value,
						Constant.DATABASE.LOAN_APPLICATION_STATUS.DRAFT.value,
						Constant.DATABASE.LOAN_APPLICATION_STATUS.FINAL_DOCUMENTS_COMPLETED.value,
						Constant.DATABASE.LOAN_APPLICATION_STATUS.INITIAL_DOCUMENTS_COMPLETED.value,
						Constant.DATABASE.LOAN_APPLICATION_STATUS.LOAN_BOOKED.value,
						Constant.DATABASE.LOAN_APPLICATION_STATUS.NEW.value,
						Constant.DATABASE.LOAN_APPLICATION_STATUS.NOOK_DECLINED.value,
						Constant.DATABASE.LOAN_APPLICATION_STATUS.NOOK_REVIEW.value,
						Constant.DATABASE.LOAN_APPLICATION_STATUS.PENDING_APPRAISAL.value,
						Constant.DATABASE.LOAN_APPLICATION_STATUS.REFERRED.value,
						Constant.DATABASE.LOAN_APPLICATION_STATUS.WAITING_ON_BORROWER.value,
						Constant.DATABASE.LOAN_APPLICATION_STATUS.DRAFT_REVIEW.value,
						Constant.DATABASE.LOAN_APPLICATION_STATUS.FINAL_CREDIT_ASSESSMENT.value,
						Constant.DATABASE.LOAN_APPLICATION_STATUS.CONDITIONAL_APPROVAL.value,

					]).default(Constant.DATABASE.LOAN_APPLICATION_STATUS.DRAFT.value),
					personalInfo: Joi.object().keys({
						firstName: Joi.string().min(1).max(32).required(),
						lastName: Joi.string().min(1).max(32),
						middleName: Joi.string().max(32).allow(''),
						monthlyIncome: Joi.number(),
						otherIncome: Joi.number(),
						motherMaidenName: Joi.string(),
						placeOfBirth: Joi.string(),
						birthDate: Joi.string(),
						nationality: Joi.string(),
						localVisa: Joi.boolean(),
						creditCard: Joi.object({
							status: Joi.string(),
							limit: Joi.number(),
							cancelled: Joi.boolean(),
						}),
						prevLoans: Joi.object({
							status: Joi.boolean(),
							monthlyTotal: Joi.number(),
							remainingTotal: Joi.number(),
						}),
						gender: Joi.string().valid([
							LoanConstant.GENDER.MALE.value,
							LoanConstant.GENDER.FEMALE.value,
							LoanConstant.GENDER.OTHER.value,
							//   DATABASE.GENDER.FEMALE,
							// Constant.DATABASE.GENDER.FEMALE,
							// Constant.DATABASE.GENDER.OTHER,
						]),
						educationBackground: Joi.string().valid([
							Constant.DATABASE.EDUCATION_BACKGROUND.POST_GRAD,
							Constant.DATABASE.EDUCATION_BACKGROUND.UNDER_GRAD,
							Constant.DATABASE.EDUCATION_BACKGROUND.COLLEGE,
							Constant.DATABASE.EDUCATION_BACKGROUND.VOCATIONAL,
						]),
						civilStatus: Joi.string().valid([
							Constant.DATABASE.CIVIL_STATUS.SINGLE,
							Constant.DATABASE.CIVIL_STATUS.WIDOW,
							Constant.DATABASE.CIVIL_STATUS.SEPERATED,
							Constant.DATABASE.CIVIL_STATUS.MARRIED,
						]),
						spouseInfo: {
							firstName: Joi.string().max(32),
							lastName: Joi.string().max(32),
							middleName: Joi.string().max(32),
							birthDate: Joi.string(),
							monthlyIncome: Joi.number(),
							isCoborrower: Joi.boolean(),
							motherMaidenName: Joi.string(),
							age: Joi.number(),
							birthPlace: Joi.string(),
						},
						coBorrowerInfo: {
							firstName: Joi.string().max(32),
							lastName: Joi.string().max(32),
							middleName: Joi.string().max(32),
							birthDate: Joi.string(),
							monthlyIncome: Joi.number(),
							isCoborrower: Joi.boolean(),
							relationship: Joi.string().valid([
								Constant.DATABASE.RELATIONSHIP.BROTHER,
								Constant.DATABASE.RELATIONSHIP.FATHER,
								Constant.DATABASE.RELATIONSHIP.MOTHER,
								Constant.DATABASE.RELATIONSHIP.SISTER,
								Constant.DATABASE.RELATIONSHIP.SPOUSE,
								Constant.DATABASE.RELATIONSHIP.SON,
								Constant.DATABASE.RELATIONSHIP.DAUGHTER,
								Constant.DATABASE.RELATIONSHIP.FIANCE,
								Constant.DATABASE.RELATIONSHIP.LIFE_DOMESTIC_PARTNER
							]),
							age: Joi.string(),
							birthPlace: Joi.string(),
							motherMaidenName: Joi.string(),
						},
					
					}),
					notificationType:Joi.string().valid(
						Constant.DATABASE.NOTIFICATION_TYPE.IMAGE,
						Constant.DATABASE.NOTIFICATION_TYPE.PERSONAL_DETAIL,
						Constant.DATABASE.NOTIFICATION_TYPE.BOTH
					),

					// saveHistory:Joi.boolean(),


					propertyInfo: {
						value: Joi.number(),
						type: Joi.string(),
						status: Joi.string(),
						developer: Joi.string(),
					},
					bankInfo: Joi.object().keys({
						path:Joi.string(),
						iconUrl: Joi.string(),
						bankId: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
						bankName: Joi.string().min(5).max(50),
						abbrevation: Joi.string().max(10),
					}),

					contactInfo: Joi.object().keys({
						phoneNumber: Joi.string(),
						email: Joi.string().email(),
						mobileNumber: Joi.string().min(7).max(15),
						// mailingAddress: Joi.object().keys({
						// 	permanentAddress: Joi.boolean(),
						// 	presentAddress: Joi.boolean(),
						// }),
						// address: {
						// permanentAddress: {
						// 	address: Joi.string(),
						// 	homeOwnership: Joi.string().valid([
						// 		Constant.DATABASE.HOME_OWNERSHIP.LIVING_WITH_RELATIVE,
						// 		Constant.DATABASE.HOME_OWNERSHIP.MORTGAGED,
						// 		Constant.DATABASE.HOME_OWNERSHIP.OWNED,
						// 		Constant.DATABASE.HOME_OWNERSHIP.RENTED,
						// 		Constant.DATABASE.HOME_OWNERSHIP.USED_FREE,
						// 	]),
						// 	lengthOfStay: { type: Number },
						// },
						// presentAddress: {
						// 	address: Joi.string(),
						// 	lengthOfStay: Joi.string(),
						// },
						// },
						// phoneNumber: Joi.string(),
						// email: Joi.string().email(),
						// mobileNumber: Joi.string().min(7).max(15),

						currentAddress: Joi.object().keys({
							address: Joi.string().max(300),
							homeOwnership: Joi.string().valid([
								Constant.DATABASE.HOME_OWNERSHIP.LIVING_WITH_RELATIVE,
								Constant.DATABASE.HOME_OWNERSHIP.MORTGAGED,
								Constant.DATABASE.HOME_OWNERSHIP.OWNED,
								Constant.DATABASE.HOME_OWNERSHIP.RENTED,
								Constant.DATABASE.HOME_OWNERSHIP.USED_FREE,
							]).required(),
							permanentResidenceSince: Joi.number().required(),
						}),
						permanentAddress: Joi.object().keys({
							address: Joi.string().max(300).required(),
							homeOwnership: Joi.string().valid([
								Constant.DATABASE.HOME_OWNERSHIP.LIVING_WITH_RELATIVE,
								Constant.DATABASE.HOME_OWNERSHIP.MORTGAGED,
								Constant.DATABASE.HOME_OWNERSHIP.OWNED,
								Constant.DATABASE.HOME_OWNERSHIP.RENTED,
								Constant.DATABASE.HOME_OWNERSHIP.USED_FREE,
							]).required(),
							permanentResidenceSince: Joi.number().required(),
						}),
						previousAddress: Joi.object().keys({
							address: Joi.string().max(300).required().trim(),
							homeOwnership: Joi.string().valid([
								Constant.DATABASE.HOME_OWNERSHIP.LIVING_WITH_RELATIVE,
								Constant.DATABASE.HOME_OWNERSHIP.MORTGAGED,
								Constant.DATABASE.HOME_OWNERSHIP.OWNED,
								Constant.DATABASE.HOME_OWNERSHIP.RENTED,
								Constant.DATABASE.HOME_OWNERSHIP.USED_FREE,
							]).required(),
							permanentResidenceSince: Joi.number().required(),
						}),
					}),
					loanDetails: Joi.object().keys({
						maxLoanTerm: Joi.number(),
						fixedPeriod: Joi.number(),
						loanTerm: Joi.number(),
						rate: Joi.number().max(100),
						monthlyRepayment: Joi.number(),
						hasCoBorrower: Joi.boolean(),
						loanType: Joi.string().valid([
							LoanConstant.LOAN_TYPES.CONSTRUCTION.value,
							LoanConstant.LOAN_TYPES.LOAN_TAKE_OUT.value,
							LoanConstant.LOAN_TYPES.PURCHASE_OF_PROPERTY.value,
							LoanConstant.LOAN_TYPES.RENOVATION.value,
							LoanConstant.LOAN_TYPES.REFINANCING.value,
							LoanConstant.LOAN_TYPES.HOME_EQUITY.value,
							LoanConstant.LOAN_TYPES.REIMBURSEMENT_LOAN.value,
							// LoanConstant.LOAN_TYPES.NEW_CONSTRUCTION.value,
						]),
						loanPercent: Joi.number(),
						loanAmount: Joi.number(),
						propertyClassification:Joi.string().valid([
							Constant.DATABASE.PROPERTY_CLASSIFICATION.DOU,
							Constant.DATABASE.PROPERTY_CLASSIFICATION.REM
						 ]),
					}),
					loanAttorneyInfo:{
						name:Joi.string().allow(''),
						contactNumber: Joi.number().allow(''),
						address: Joi.string().max(300).allow(''),
						relationship: Joi.string().valid([
							Constant.DATABASE.RELATIONSHIP.BROTHER,
							Constant.DATABASE.RELATIONSHIP.FATHER,
							Constant.DATABASE.RELATIONSHIP.MOTHER,
							Constant.DATABASE.RELATIONSHIP.SISTER,
							Constant.DATABASE.RELATIONSHIP.SPOUSE,
							Constant.DATABASE.RELATIONSHIP.SON,
							Constant.DATABASE.RELATIONSHIP.DAUGHTER,
							Constant.DATABASE.RELATIONSHIP.FIANCE,
							Constant.DATABASE.RELATIONSHIP.LIFE_DOMESTIC_PARTNER
						]).allow(''),


					},

					employmentInfo: Joi.object().keys({
						type: Joi.string(),
						rank: Joi.string(),
						tenure: Joi.string(),
						tin: Joi.string(),
						companyName: Joi.string().min(1).max(300),
						sss: Joi.string(),
						officePhone: Joi.string(),
						officeEmail: Joi.string(),
						officeAddress: Joi.string().max(300),
						companyIndustry: Joi.string().valid([
							INDUSTRIES.AGRI_FOREST_FISH.value,
							INDUSTRIES.ADVERTISING.value,
							INDUSTRIES.BUSINESS_INFORMATION.value,
							INDUSTRIES.CONST_UTIL_CONTRACT.value,
							INDUSTRIES.EDUCATION.value,
							INDUSTRIES.ENTERTAINMENT_FASHION.value,
							INDUSTRIES.FINANCE_INSURANCE.value,
							INDUSTRIES.FOOD_HOSPITALITY.value,
							INDUSTRIES.GAMING.value,
							INDUSTRIES.HEALTH_SERVICES.value,
							INDUSTRIES.INFORMATION_TECHNOLOGY.value,
							INDUSTRIES.MANUFACTURING.value,
							INDUSTRIES.MOTOR_VEHICLE.value,
							INDUSTRIES.MUSIC_MEDIA.value,
							INDUSTRIES.NATURAL_RES_ENV.value,
							INDUSTRIES.OTHER.value,
							INDUSTRIES.PERSONAL_SERVICES.value,
							INDUSTRIES.REAL_ESTATE_HOUSING.value,
							INDUSTRIES.RETAIL.value,
							INDUSTRIES.SAFETY_SECURITY_LEGAL.value,
							INDUSTRIES.TRANSPORTATION.value,
						]),
						grossMonthlyIncome: Joi.string(),
						provinceState: Joi.string(),
						country: Joi.string(),
						coBorrowerInfo: {
							employmentType: Joi.string().valid([
								EMPLOYMENT_TYPE.BPO.value,
								EMPLOYMENT_TYPE.GOVT.value,
								EMPLOYMENT_TYPE.OFW.value,
								EMPLOYMENT_TYPE.PRIVATE.value,
								EMPLOYMENT_TYPE.PROFESSIONAL.value,
								EMPLOYMENT_TYPE.SELF.value,
								EMPLOYMENT_TYPE.COMMISSION_BASED.value,
								EMPLOYMENT_TYPE.FOREIGN_NATIONALS.value,
								EMPLOYMENT_TYPE.FREELANCER.value
							]),
							tin: Joi.string(),
							companyName: Joi.string(),
							sss: Joi.string(),
							employmentRank: Joi.string().valid([
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
							]),
							employmentTenure: Joi.string().valid(Object.keys(EMPLOYMENT_TENURE)),
							companyIndustry: Joi.string().valid([
								INDUSTRIES.AGRI_FOREST_FISH.value,
								INDUSTRIES.ADVERTISING.value,
								INDUSTRIES.BUSINESS_INFORMATION.value,
								INDUSTRIES.CONST_UTIL_CONTRACT.value,
								INDUSTRIES.EDUCATION.value,
								INDUSTRIES.ENTERTAINMENT_FASHION.value,
								INDUSTRIES.FINANCE_INSURANCE.value,
								INDUSTRIES.FOOD_HOSPITALITY.value,
								INDUSTRIES.GAMING.value,
								INDUSTRIES.HEALTH_SERVICES.value,
								INDUSTRIES.INFORMATION_TECHNOLOGY.value,
								INDUSTRIES.MANUFACTURING.value,
								INDUSTRIES.MOTOR_VEHICLE.value,
								INDUSTRIES.MUSIC_MEDIA.value,
								INDUSTRIES.NATURAL_RES_ENV.value,
								INDUSTRIES.OTHER.value,
								INDUSTRIES.PERSONAL_SERVICES.value,
								INDUSTRIES.REAL_ESTATE_HOUSING.value,
								INDUSTRIES.RETAIL.value,
								INDUSTRIES.SAFETY_SECURITY_LEGAL.value,
								INDUSTRIES.TRANSPORTATION.value,
							]),
							officePhone: Joi.number(),
							officeEmail: Joi.string().email(),
							officeAddress: Joi.string().max(300),
						},
					}),
					dependentsInfo: Joi.array().items({
						name: Joi.string(),
						age: Joi.number(),
						relationship: Joi.string().valid([
							Constant.DATABASE.RELATIONSHIP.BROTHER,
							Constant.DATABASE.RELATIONSHIP.FATHER,
							Constant.DATABASE.RELATIONSHIP.MOTHER,
							Constant.DATABASE.RELATIONSHIP.SISTER,
							Constant.DATABASE.RELATIONSHIP.SPOUSE,
							Constant.DATABASE.RELATIONSHIP.SON,
							Constant.DATABASE.RELATIONSHIP.DAUGHTER,
							Constant.DATABASE.RELATIONSHIP.FIANCE,
							Constant.DATABASE.RELATIONSHIP.LIFE_DOMESTIC_PARTNER
						]),
					}),

					tradeReferences: Joi.array().items({
						companyName: Joi.string(),
						type: Joi.string().valid([
							TRADE_REFERENCE.CUSTOMER,
							TRADE_REFERENCE.SUPPLIER,
						]),
						contactPerson: Joi.string(),
						contactNumber: Joi.string(),
						position: Joi.string(),
					}),
					// propertyDocuments: Joi.object().keys({
					// 	borrowerValidDocIds: Joi.array().items(Joi.string()),
					// 	coBorrowerValidId: Joi.array().items(Joi.string()),
					// 	latestITR: Joi.string().uri(),
					// 	employmentCert: Joi.string().uri(),
					// 	purchasePropertyInfo: Joi.object().keys({
					// 		address: Joi.string().max(300),
					// 		contactPerson: Joi.string(),
					// 		contactNumber: Joi.number(),
					// 		collateralDocStatus: Joi.boolean(),
					// 		collateralDocList: Joi.array().items({
					// 			docType: Joi.string().valid([
					// 				Constant.DATABASE.COLLATERAL.DOC.TYPE.RESERVE_AGREEMENT,
					// 				Constant.DATABASE.COLLATERAL.DOC.TYPE.TAX_DECLARATION_1,
					// 				Constant.DATABASE.COLLATERAL.DOC.TYPE.TAX_DECLARATION_2,
					// 				Constant.DATABASE.COLLATERAL.DOC.TYPE.BILL_MATERIAL,
					// 				Constant.DATABASE.COLLATERAL.DOC.TYPE.FLOOR_PLAN,
					// 			]),
					// 			docUrl: Joi.string(),
					// 		}),
					// 	}),
					// 	nookAgent: Joi.string(),
					// }),
					documents: {
						purchasePropertyInfo: Joi.object().keys({
							address: Joi.string().max(300).required(),
							contactPerson: Joi.string().required(),
							contactNumber: Joi.string().required(),
						}),
						legalDocument: Joi.array().items(objectSchema),
						incomeDocument: Joi.array().items(objectSchema),
						colleteralDoc: Joi.array().items(objectSchema),
					},
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
	 * @description shufffled banks list
	 */
	{
		method: 'GET',
		path: '/v1/banks/shuffle',
		handler: async (request, h: ResponseToolkit) => {
			try {
				const data = await LoanController.loanShuffle();
				return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.DEFAULT, data));
			} catch (error) {
				UniversalFunctions.consolelog('error', error, true);
				return (UniversalFunctions.sendError(error));
			}
		},
		options: {
			description: 'get abnk images data shufedl',
			tags: ['api', 'anonymous', 'user', 'shuffle', 'banks'],
			auth: 'DoubleAuth',
			validate: {
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
	 * @desciption create pdf of the home loan application
	 */
	{
		method: 'GET',
		path: '/v1/admin/loan-pdf/{loanId}',
		handler: async (request, h: ResponseToolkit) => {
			try {
				const userData = request.auth && request.auth.credentials && (request.auth.credentials as any).adminData;
				const payload = request.params as any;
				const data = await LoanController.downloadPdf(payload, userData);
				return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.DEFAULT, data));
			} catch (error) {
				UniversalFunctions.consolelog('error', error, true);
				UniversalFunctions.errorReporter(error);
				return (UniversalFunctions.sendError(error));
			}
		},
		options: {
			description: 'update loan by id',
			tags: ['api', 'anonymous', 'user', 'user', 'Article'],
			auth: 'AdminAuth',
			validate: {
				params: {
					loanId: Joi.string().trim(), // referenceId
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
	 * @description user upload document
	 */
	{
		method: 'GET',
		path: '/v1/user/loan/document/{bankId}',
		handler: async (request, h: ResponseToolkit) => {
			try {
				// const userData = request.auth && request.auth.credentials && (request.auth.credentials as any).adminData;
				const payload = {
					...request.params as any,
					...request.query as any,
				};
				const data = await LoanController.getDocuments(payload);
				return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.DEFAULT, data));
			} catch (error) {
				UniversalFunctions.consolelog(error, 'error', true);
				return (UniversalFunctions.sendError(error));
			}
		},
		options: {
			description: 'add Loan Requirements',
			tags: ['api', 'anonymous', 'loan', 'Add'],
			// auth: 'UserAuth',
			validate: {
				params: {
					bankId: Joi.string().regex(/^[0-9a-fA5-F]{24}$/).required(),
				},
				query: {
					// personalInfo: Joi.object().keys({
					civilStatus: Joi.string().valid([
						Constant.DATABASE.CIVIL_STATUS.SINGLE,
						Constant.DATABASE.CIVIL_STATUS.WIDOW,
						Constant.DATABASE.CIVIL_STATUS.SEPERATED,
						Constant.DATABASE.CIVIL_STATUS.MARRIED,
					]),
					coBorrowerInfo: Joi.boolean(),
					employmentType: Joi.string().valid([
						EMPLOYMENT_TYPE.BPO.value,
						EMPLOYMENT_TYPE.GOVT.value,
						EMPLOYMENT_TYPE.OFW.value,
						EMPLOYMENT_TYPE.PRIVATE.value,
						EMPLOYMENT_TYPE.PROFESSIONAL.value,
						EMPLOYMENT_TYPE.SELF.value,
						EMPLOYMENT_TYPE.COMMISSION_BASED.value,
						EMPLOYMENT_TYPE.FOREIGN_NATIONALS.value,
						EMPLOYMENT_TYPE.FREELANCER.value
					]).required(),
					propertyStatus: Joi.string().valid([
						LOAN_PROPERTY_STATUS.NEW_CONSTRUCTION.value,
						LOAN_PROPERTY_STATUS.PRE_SELLING.value,
						LOAN_PROPERTY_STATUS.READY_FOR_OCCUPANCY.value,
						LOAN_PROPERTY_STATUS.REFINANCING.value,
						LOAN_PROPERTY_STATUS.RENOVATION.value,
						LOAN_PROPERTY_STATUS.RESELLING.value,
						LOAN_PROPERTY_STATUS.FORECLOSED.value,
					]).required(),
					loanAmount: Joi.number(),
					loanType:Joi.string().valid([
						LOAN_TYPES.CONSTRUCTION.value,
						LOAN_TYPES.PURCHASE_OF_PROPERTY.value,
						LOAN_TYPES.REFINANCING.value,
						LOAN_TYPES.REIMBURSEMENT_LOAN.value,
						LOAN_TYPES.RENOVATION.value,
						LOAN_TYPES.HOME_EQUITY.value,
						LOAN_TYPES.LOAN_TAKE_OUT.value
					]).required()
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


	{
		method: 'GET',
		path: '/v1/admin/loan/document/{bankId}',
		handler: async (request, h: ResponseToolkit) => {
			try {
				// const userData = request.auth && request.auth.credentials && (request.auth.credentials as any).adminData;
				const payload: LoanRequest.AddLoan = {
					...request.params as any,
					...request.query as any,
				};
				const data = await LoanController.getDocuments(payload);
				return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S201.CREATED, data));
			} catch (error) {
				UniversalFunctions.consolelog(error, 'error', true);
				return (UniversalFunctions.sendError(error));
			}
		},
		options: {
			description: 'add Loan Requirements',
			tags: ['api', 'anonymous', 'loan', 'Add'],
			auth: 'AdminAuth',
			validate: {
				params: {
					bankId: Joi.string(),
				},
				query: {
					// personalInfo: Joi.object().keys({
					civilStatus: Joi.string().valid([
						Constant.DATABASE.CIVIL_STATUS.SINGLE,
						Constant.DATABASE.CIVIL_STATUS.WIDOW,
						Constant.DATABASE.CIVIL_STATUS.SEPERATED,
						Constant.DATABASE.CIVIL_STATUS.MARRIED,
					]),
					coBorrowerInfo: Joi.boolean(),
					employmentType: Joi.string().valid([
						EMPLOYMENT_TYPE.BPO.value,
						EMPLOYMENT_TYPE.GOVT.value,
						EMPLOYMENT_TYPE.OFW.value,
						EMPLOYMENT_TYPE.PRIVATE.value,
						EMPLOYMENT_TYPE.PROFESSIONAL.value,
						EMPLOYMENT_TYPE.SELF.value,
						EMPLOYMENT_TYPE.COMMISSION_BASED.value,
						EMPLOYMENT_TYPE.FOREIGN_NATIONALS.value,
						EMPLOYMENT_TYPE.FREELANCER.value
					]).required(),
					propertyStatus: Joi.string().valid([
						LOAN_PROPERTY_STATUS.NEW_CONSTRUCTION.value,
						LOAN_PROPERTY_STATUS.PRE_SELLING.value,
						LOAN_PROPERTY_STATUS.READY_FOR_OCCUPANCY.value,
						LOAN_PROPERTY_STATUS.REFINANCING.value,
						LOAN_PROPERTY_STATUS.RENOVATION.value,
						LOAN_PROPERTY_STATUS.RESELLING.value,
						LOAN_PROPERTY_STATUS.FORECLOSED.value,
					]).required(),
					loanAmount: Joi.number(),
					loanType:Joi.string().required(),
					classification:Joi.string().required()
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
	 * @description user update profile
	 */
	{
		method: 'PATCH',
		path: '/v1/user/loan/document/{loanId}',
		handler: async (request, h: ResponseToolkit) => {
			try {
				// const userData = request.auth && request.auth.credentials && (request.auth.credentials as any).adminData;
				const payload = {
					...request.params as any,
					...request.payload as any,
				};

				const data = await LoanController.updateDocument(payload);
				return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.DEFAULT, data));
			} catch (error) {
				UniversalFunctions.consolelog(error, 'error', true);
				return (UniversalFunctions.sendError(error));
			}
		},
		options: {
			description: 'add Loan Requirements',
			tags: ['api', 'anonymous', 'loan', 'Add'],
			auth: 'UserAuth',
			validate: {
				params: {
					loanId: Joi.string(),
				},
				payload: {
					documentType: Joi.string().valid([
						LoanConstant.documentType.COLLETERAL,
						LoanConstant.documentType.INCOME,
						LoanConstant.documentType.LEGAL,
					]),
					documentRequired: Joi.string().allow('').allow(null),
					description: Joi.string(),
					documentId: Joi.string(),
					url: Joi.string(),
					createdAt: Joi.number(),
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