import { ServerRoute, ResponseToolkit } from 'hapi';
import * as Joi from 'joi';
import * as UniversalFunctions from '@src/utils';
import * as Constant from '@src/constants/app.constant';
import { LoanController } from '@src/controllers';
import { LOAN_PROPERTY_TYPES, LOAN_PROPERTY_STATUS, EMPLOYMENT_TYPE, EMPLOYMENT_RANK, EMPLOYMENT_TENURE, INDUSTRIES, TRADE_REFERENCE } from '@src/constants';
import { LoanRequest } from '@src/interfaces/loan.interface';
import * as LoanConstant from '../../constants/loan.constant';
export let loanRoute: ServerRoute[] = [
	{
		method: 'POST',
		path: '/v1/user/loan/application',
		handler: async (request, h: ResponseToolkit) => {
			try {
				const userData = request.auth && request.auth.credentials && (request.auth.credentials as any).userData;
				const payload: LoanRequest.AddLoan = request.payload as any;
				console.log('payloadpayloadpayloadpayloadpayloadpayloadpayload', payload);

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
					personalInfo: Joi.object().keys({
						firstName: Joi.string().min(1).max(32).required(),
						lastName: Joi.string().min(1).max(32),
						middleName: Joi.string().max(32).allow(''),
						monthlyIncome: Joi.number(),
						otherIncome: Joi.number(),
						motherMaidenName: Joi.string(),
						birthDate: Joi.number(),
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
							birthDate: Joi.number(),
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
							birthDate: Joi.number(),
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
							address: Joi.string().max(300),
							homeOwnership: Joi.string().valid([
								Constant.DATABASE.HOME_OWNERSHIP.LIVING_WITH_RELATIVE,
								Constant.DATABASE.HOME_OWNERSHIP.MORTGAGED,
								Constant.DATABASE.HOME_OWNERSHIP.OWNED,
								Constant.DATABASE.HOME_OWNERSHIP.RENTED,
								Constant.DATABASE.HOME_OWNERSHIP.USED_FREE,
							]),
						}),
						// mailingAddress: {
						// 	permanentAddress: Joi.boolean(),
						// 	presentAddress: Joi.boolean(),
						// },
						// // { type: Boolean, enum: ['Permanent Address', 'Present Address'] },
						// address: {
						// 	permanentAddress: {
						// 		address: Joi.string(),
						// 		homeOwnership: Joi.string().valid([
						// 			Constant.DATABASE.HOME_OWNERSHIP.LIVING_WITH_RELATIVE,
						// 			Constant.DATABASE.HOME_OWNERSHIP.MORTGAGED,
						// 			Constant.DATABASE.HOME_OWNERSHIP.OWNED,
						// 			Constant.DATABASE.HOME_OWNERSHIP.RENTED,
						// 			Constant.DATABASE.HOME_OWNERSHIP.USED_FREE,
						// 		]),
						// 		lengthOfStay: Joi.number(),
						// 	},
						// 	presentAddress: {
						// 		address: Joi.string(),
						// 		lengthOfStay: Joi.number(),
						// 	},
						// },
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
							// LoanConstant.LOAN_TYPES.NEW_CONSTRUCTION.value,

						]),
						loanPercent: Joi.number(),
						loanAmount: Joi.number(),
					}),

					employmentInfo: Joi.object().keys({
						type: Joi.string().valid([
							EMPLOYMENT_TYPE.BPO.value,
							EMPLOYMENT_TYPE.GOVT.value,
							EMPLOYMENT_TYPE.OFW.value,
							EMPLOYMENT_TYPE.PRIVATE.value,
							EMPLOYMENT_TYPE.PROFESSIONAL.value,
							EMPLOYMENT_TYPE.SELF.value,
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

					propertyDocuments: Joi.object().keys({
						borrowerValidDocIds: Joi.array().items(Joi.string()),
						coBorrowerValidId: Joi.array().items(Joi.string()),
						latestITR: Joi.string().uri(),
						employmentCert: Joi.string().uri(),
						purchasePropertyInfo: Joi.object().keys({
							address: Joi.string().max(300),
							contactPerson: Joi.string(),
							contactNumber: Joi.number(),
							collateralDocStatus: Joi.boolean(),
							collateralDocList: Joi.array().items({
								docType: Joi.string().valid([
									Constant.DATABASE.COLLATERAL.DOC.TYPE.RESERVE_AGREEMENT,
									Constant.DATABASE.COLLATERAL.DOC.TYPE.TAX_DECLARATION_1,
									Constant.DATABASE.COLLATERAL.DOC.TYPE.TAX_DECLARATION_2,
									Constant.DATABASE.COLLATERAL.DOC.TYPE.BILL_MATERIAL,
									Constant.DATABASE.COLLATERAL.DOC.TYPE.FLOOR_PLAN,
								]),
								docUrl: Joi.string(),
							}),
						}),
						nookAgent: Joi.string(),
					}),
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
				console.log('payloadpayloadpayloadpayloadpayload', payload);

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
					// saveAsDraft: Joi.boolean().required(),
					applicationStatus: Joi.string().valid([
						// Constant.DATABASE.LOAN_APPLICATION_STATUS.BANK_APPROVED.value,
						// Constant.DATABASE.LOAN_APPLICATION_STATUS.BANK_DECLINED.value,
						Constant.DATABASE.LOAN_APPLICATION_STATUS.DRAFT.value,
						Constant.DATABASE.LOAN_APPLICATION_STATUS.NEW.value,
						// Constant.DATABASE.LOAN_APPLICATION_STATUS.NOOK_DECLINED.value,
						// Constant.DATABASE.LOAN_APPLICATION_STATUS.NOOK_REVIEW.value,
						// Constant.DATABASE.LOAN_APPLICATION_STATUS.REFERRED.value,
					]).default(Constant.DATABASE.LOAN_APPLICATION_STATUS.DRAFT.value),
					personalInfo: Joi.object().keys({
						firstName: Joi.string().min(1).max(32).required(),
						lastName: Joi.string().min(1).max(32),
						middleName: Joi.string().max(32).allow(''),
						monthlyIncome: Joi.number(),
						otherIncome: Joi.number(),
						motherMaidenName: Joi.string(),
						birthDate: Joi.number(),
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
							birthDate: Joi.number(),
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
							birthDate: Joi.number(),
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
							]),
							age: Joi.string(),
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

					// applicationStatus: Joi.string().valid([
					// 	Constant.DATABASE.LOAN_APPLICATION_STATUS.DRAFT.value,
					// 	Constant.DATABASE.LOAN_APPLICATION_STATUS.NEW.value,
					// ]).default(Constant.DATABASE.LOAN_APPLICATION_STATUS.NEW.value),
					bankInfo: Joi.object().keys({
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
							]),
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
							LoanConstant.LOAN_TYPES.RENOVATION.value,
							LoanConstant.LOAN_TYPES.REFINANCING.value,
							// LoanConstant.LOAN_TYPES.NEW_CONSTRUCTION.value,
						]),
						loanPercent: Joi.number(),
						loanAmount: Joi.number(),
					}),

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
						]),
					}),

					propertyDocuments: Joi.object().keys({
						borrowerValidDocIds: Joi.array().items(Joi.string()),
						coBorrowerValidId: Joi.array().items(Joi.string()),
						latestITR: Joi.string().uri(),
						employmentCert: Joi.string().uri(),
						purchasePropertyInfo: Joi.object().keys({
							address: Joi.string().max(300),
							contactPerson: Joi.string(),
							contactNumber: Joi.number(),
							collateralDocStatus: Joi.boolean(),
							collateralDocList: Joi.array().items({
								docType: Joi.string().valid([
									Constant.DATABASE.COLLATERAL.DOC.TYPE.RESERVE_AGREEMENT,
									Constant.DATABASE.COLLATERAL.DOC.TYPE.TAX_DECLARATION_1,
									Constant.DATABASE.COLLATERAL.DOC.TYPE.TAX_DECLARATION_2,
									Constant.DATABASE.COLLATERAL.DOC.TYPE.BILL_MATERIAL,
									Constant.DATABASE.COLLATERAL.DOC.TYPE.FLOOR_PLAN,
								]),
								docUrl: Joi.string(),
							}),
						}),
						nookAgent: Joi.string(),
					}),
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
				console.log('payloadpayloadpayloadpayloadpayload', payload);

				const data = await LoanController.downloadPdf(payload, userData);
				return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.DEFAULT, data));
			} catch (error) {
				UniversalFunctions.consolelog('error', error, true);
				return (UniversalFunctions.sendError(error));
			}
		},
		options: {
			description: 'update loan by id',
			tags: ['api', 'anonymous', 'user', 'user', 'Article'],
			auth: 'AdminAuth',
			validate: {
				params: {
					loanId: Joi.string(),
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