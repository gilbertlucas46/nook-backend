import { ServerRoute, ResponseToolkit } from 'hapi';
import * as Joi from 'joi';
import * as UniversalFunctions from '@src/utils';
import * as Constant from '@src/constants/app.constant';
import { LoanController } from '@src/controllers';
import { LOAN_PROPERTY_TYPES, LOAN_PROPERTY_STATUS, EMPLOYMENT_TYPE, EMPLOYMENT_RANK, EMPLOYMENT_TENURE } from '@src/constants';
import { LoanRequest } from '@src/interfaces/loan.interface';

export let loanRoute: ServerRoute[] = [
	// {
	// 	method: 'POST',
	// 	path: '/v1/loan',
	// 	handler: async (request, h: ResponseToolkit) => {
	// 		try {
	// 			const payload = request.payload as LoanRequest.IAddLoanRequirement;
	// 			await LoanController.addLoanRequirements(payload);
	// 			return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S201.CREATED, {}));
	// 		} catch (error) {
	// 			return (UniversalFunctions.sendError(error));
	// 		}
	// 	},
	// 	options: {
	// 		description: 'add Loan Requirements',
	// 		tags: ['api', 'anonymous', 'loan', 'Add'],
	// 		auth: 'UserAuth',
	// 		validate: {
	// 			payload: {
	// 				abbrevation: Joi.string().min(2).max(6).required(),
	// 				bankName: Joi.string().min(3).max(80).required(),
	// 				headquarterLocation: Joi.string().min(3).max(50).required(),
	// 				propertySpecification: Joi.array().items({
	// 					allowedPropertyType: Joi.string().valid([
	// 						LOAN_PROPERTY_TYPES.APARTMENT.value,
	// 						LOAN_PROPERTY_TYPES.CONDOMINIUM.value,
	// 						LOAN_PROPERTY_TYPES.HOUSE_LOT.value,
	// 						LOAN_PROPERTY_TYPES.TOWNHOUSE.value,
	// 						LOAN_PROPERTY_TYPES.VACANT_LOT.value,
	// 					]).required(),
	// 					allowedPropertyStatus: Joi.array().items(Joi.string().valid([
	// 						LOAN_PROPERTY_STATUS.FORECLOSED.value,
	// 						LOAN_PROPERTY_STATUS.REFINANCING.value,
	// 						LOAN_PROPERTY_STATUS.PRE_SELLING.value,
	// 						LOAN_PROPERTY_STATUS.READY_FOR_OCCUPANCY.value,
	// 						LOAN_PROPERTY_STATUS.RESELLING.value,
	// 					])).required(),
	// 					maxLoanDurationAllowed: Joi.number().max(30).required(),
	// 					maxLoanPercent: Joi.number().min(3).max(80),
	// 					debtIncomeRatio: Joi.number().min(0).max(100).required(),
	// 				}).required(),
	// 				interestRateDetails: Joi.object().required(),
	// 				bankFeePercent: Joi.number(),
	// 				bankFeeAmount: Joi.number(),
	// 				debtIncomeRatio: Joi.number().max(100),
	// 				loanApplicationFeePercent: Joi.number(),
	// 				loanMinAmount: Joi.number().required(),
	// 				loanMaxAmount: Joi.number().required(),
	// 				minLoanDuration: Joi.number().min(12).max(360),
	// 				maxLoanDuration: Joi.number().max(360),
	// 				loanForForeigner: Joi.boolean(),
	// 				loanForForeignerMarriedLocal: Joi.boolean(),
	// 				loanForNonCreditCardHolder: Joi.boolean(),
	// 				loanForCreditCardHolder: Joi.boolean(),
	// 				loanForNotNowCreditCardHolder: Joi.boolean(),
	// 				loanForCancelledCreditCard: Joi.boolean(),
	// 				minAgeRequiredForLoan: Joi.number().min(21).max(65),
	// 				maxAgeRequiredForLoan: Joi.number().min(21).max(65),
	// 				loanAlreadyExistDiffBank: Joi.boolean(),
	// 				loanAlreadyExistSameBank: Joi.boolean(),
	// 				minMonthlyIncomeLoan: Joi.number(),
	// 				minMonthlyIncomeRequired: Joi.number(),
	// 				missedLoanPaymentAllowance: Joi.boolean(),
	// 				bankImageLogoUrl: Joi.string().allow(''),

	// 				loanForEmploymentType: Joi.array().items({
	// 					employmentType: Joi.string().valid([
	// 						EMPLOYMENT_TYPE.BPO.value,
	// 						EMPLOYMENT_TYPE.GOVT.value,
	// 						EMPLOYMENT_TYPE.OFW.value,
	// 						EMPLOYMENT_TYPE.PRIVATE.value,
	// 						EMPLOYMENT_TYPE.PROFESSIONAL.value,
	// 						EMPLOYMENT_TYPE.SELF.value,
	// 					]),
	// 					employmentRank: Joi.array().items(Joi.string().valid([
	// 						EMPLOYMENT_RANK.ASSISSTANT_VICE_PRESIDENT.value,
	// 						EMPLOYMENT_RANK.ASSISTANT_MANAGER.value,
	// 						EMPLOYMENT_RANK.CHAIRMAN.value,
	// 						EMPLOYMENT_RANK.CHIEF_EXECUTIVE_OFFICER.value,
	// 						EMPLOYMENT_RANK.CLERK.value,
	// 						EMPLOYMENT_RANK.DIRECTOR.value,
	// 						EMPLOYMENT_RANK.EXECUTIVE_VICE_PRESIDENT.value,
	// 						EMPLOYMENT_RANK.FIRST_VICE_PRESIDENT.value,
	// 						EMPLOYMENT_RANK.GENERAL_EMPLOYEE.value,
	// 						EMPLOYMENT_RANK.MANAGER.value,
	// 						EMPLOYMENT_RANK.NON_PROFESIONNAL.value,
	// 						EMPLOYMENT_RANK.OWNER.value,
	// 						EMPLOYMENT_RANK.PRESIDENT.value,
	// 						EMPLOYMENT_RANK.PROFESSIONAL.value,
	// 						EMPLOYMENT_RANK.RANK_FILE.value,
	// 						EMPLOYMENT_RANK.SENIOR_ASSISTANT_MANAGER.value,
	// 						EMPLOYMENT_RANK.SENIOR_ASSISTANT_VICE_PRESIDENT.value,
	// 						EMPLOYMENT_RANK.SENIOR_MANAGER.value,
	// 						EMPLOYMENT_RANK.SENIOR_VICE_PRESIDENT.value,
	// 						EMPLOYMENT_RANK.SUPERVISOR.value,
	// 						EMPLOYMENT_RANK.VICE_PRESIDENT.value,
	// 					])),
	// 					minEmploymentTenure: Joi.number(),
	// 				}),
	// 			},
	// 			headers: UniversalFunctions.authorizationHeaderObj,
	// 			failAction: UniversalFunctions.failActionFunction,
	// 		},
	// 		plugins: {
	// 			'hapi-swagger': {
	// 				responseMessages: Constant.swaggerDefaultResponseMessages,
	// 			},
	// 		},
	// 	},
	// },
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
				return (UniversalFunctions.sendError(error));
			}
		},
		options: {
			description: 'add Loan Requirements',
			tags: ['api', 'anonymous', 'loan', 'Add'],
			auth: 'UserAuth',
			validate: {
				payload: {
					// userId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
					// saveAsDraft: Joi.boolean().required(),
					personalInfo: Joi.object().keys({
						firstName: Joi.string().min(1).max(32).required(),
						lastName: Joi.string().min(1).max(32),
						middleName: Joi.string().max(32).allow(''),
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
							Constant.DATABASE.CIVIL_STATUS.SINGLE,
							Constant.DATABASE.CIVIL_STATUS.WIDOW,
							Constant.DATABASE.CIVIL_STATUS.SEPERATED,
							Constant.DATABASE.CIVIL_STATUS.MARRIED,
						]),
						spouseFirstName: Joi.string().min(1).max(32),
						spouseMiddleName: Joi.string().min(1).max(32).allow(''),
						spouseLastName: Joi.string().min(1).max(32),
						motherMaidenName: Joi.string(),
						birthDate: Joi.number(),
						coBorrowerFirstName: Joi.string().min(1).max(32),
						coBorrowerMiddleName: Joi.string().min(1).max(32).allow(''),
						coBorrowerLastName: Joi.string().min(1).max(32),
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
					applicationStatus: Joi.string().valid([
						Constant.DATABASE.LOAN_APPLICATION_STATUS.BANK_APPROVED.value,
						Constant.DATABASE.LOAN_APPLICATION_STATUS.BANK_DECLINED.value,
						Constant.DATABASE.LOAN_APPLICATION_STATUS.DRAFT.value,
						Constant.DATABASE.LOAN_APPLICATION_STATUS.NEW.value,
						Constant.DATABASE.LOAN_APPLICATION_STATUS.NOOK_DECLINED.value,
						Constant.DATABASE.LOAN_APPLICATION_STATUS.NOOK_REVIEW.value,
						Constant.DATABASE.LOAN_APPLICATION_STATUS.REFERRED.value,
					]),
					bankInfo: Joi.object().keys({
						iconUrl: Joi.string(),
						bankId: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
						bankName: Joi.string().min(5).max(50),
						abbrevation: Joi.string().max(10),
					}),
					contactInfo: Joi.object().keys({
						phoneNumber: Joi.string(),
						email: Joi.string().email(),
						mobileNumber: Joi.string().min(8).max(15),
						currentAddress: Joi.object().keys({
							address: Joi.string().max(300),
							// regionId: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
							// cityId: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
							// regionName: Joi.string().min(1).max(32),
							// cityName: Joi.string().min(1).max(32),
							// barangay: Joi.string().min(1).max(32),
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
						fixedPeriod: Joi.number(),
						loanTerm: Joi.number(),
						rate: Joi.number().max(100),
						monthlyRepayment: Joi.number(),
						hasCoBorrower: Joi.boolean(),
						loanType: Joi.string(),
						loanPercent: Joi.number(),
						loanAmount: Joi.number(),
						propertyValue: Joi.number(),
					}),
					employmentInfo: Joi.object().keys({
						tin: Joi.string(),
						companyName: Joi.string().min(1).max(300),
						sss: Joi.string(),
						officePhone: Joi.string(),
						officeEmail: Joi.string(),
						officeAddress: Joi.string().max(300),
						companyIndustry: Joi.string().valid([
							Constant.DATABASE.INDUSTRY.AGRI_FOREST_FISH,
							Constant.DATABASE.INDUSTRY.ACCOMOD_FOOD_SERVICES,
							Constant.DATABASE.INDUSTRY.ARTS_ENTERTAINMENT_RECREATION,
							Constant.DATABASE.INDUSTRY.COMMUNICATION,
							Constant.DATABASE.INDUSTRY.CONSTRUCTION,
							Constant.DATABASE.INDUSTRY.EDUCATION,
							Constant.DATABASE.INDUSTRY.IT,
							Constant.DATABASE.INDUSTRY.OTHERS,
						]),
						// cityId: Joi.string().regex(/^[0-9a-fA-F]{24}$/),      // Refer to city schema
						// cityName: Joi.string(),
						// regionId: Joi.string().regex(/^[0-9a-fA-F]{24}$/), // Refer to region schema
						// regionName: Joi.string(),
						// barangay: Joi.string(),
						// country: Joi.string(),
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
								Constant.DATABASE.INDUSTRY.AGRI_FOREST_FISH,
								Constant.DATABASE.INDUSTRY.ACCOMOD_FOOD_SERVICES,
								Constant.DATABASE.INDUSTRY.ARTS_ENTERTAINMENT_RECREATION,
								Constant.DATABASE.INDUSTRY.COMMUNICATION,
								Constant.DATABASE.INDUSTRY.CONSTRUCTION,
								Constant.DATABASE.INDUSTRY.EDUCATION,
								Constant.DATABASE.INDUSTRY.IT,
								Constant.DATABASE.INDUSTRY.OTHERS,
							]),
							officePhone: Joi.number(),
							officeEmail: Joi.string().email(),
							officeAddress: Joi.string().max(300),
							// cityId: Joi.string().regex(/^[0-9a-fA-F]{24}$/),     // Refer to city schema
							// cityName: Joi.string(),
							// regionId: Joi.string().regex(/^[0-9a-fA-F]{24}$/), // Refer to region schema
							// regionName: Joi.string(),
							// barangay: Joi.string(),
							// country: Joi.string(),
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
							// regionId: Joi.string().regex(/^[0-9a-fA-F]{24}$/), // Refer to region schema
							// cityId: Joi.string().regex(/^[0-9a-fA-F]{24}$/),     // Refer to city schema
							// regionName: Joi.string(),
							// cityName: Joi.string(),
							// barangay: Joi.string(),
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
				// return UniversalFunctions. (Constant.STATUS_MSG.SUCCESS.S200.DEFAULT, data);
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
				const payload: LoanRequest.AddLoan = request.payload as any;
				const data = await LoanController.updateLoanApplication(payload);
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
				payload: {
					loanId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
					saveAsDraft: Joi.boolean().required(),
					personalInfo: Joi.object().keys({
						firstName: Joi.string().min(1).max(32).required(),
						lastName: Joi.string().min(1).max(32),
						middleName: Joi.string().max(32),
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
							Constant.DATABASE.CIVIL_STATUS.SINGLE,
							Constant.DATABASE.CIVIL_STATUS.WIDOW,
							Constant.DATABASE.CIVIL_STATUS.SEPERATED,
							Constant.DATABASE.CIVIL_STATUS.MARRIED,
						]),
						spouseFirstName: Joi.string().min(1).max(32),
						spouseMiddleName: Joi.string().min(1).max(32),
						spouseLastName: Joi.string().min(1).max(32),
						motherMaidenName: Joi.string(),
						birthDate: Joi.number(),
						coBorrowerFirstName: Joi.string().min(1).max(32),
						coBorrowerMiddleName: Joi.string().min(1).max(32),
						coBorrowerLastName: Joi.string().min(1).max(32),
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
					bankInfo: Joi.object().keys({
						iconUrl: Joi.string(),
						bankId: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
						bankName: Joi.string().min(5).max(50),
						abbrevation: Joi.string().max(10),
					}),
					contactInfo: Joi.object().keys({
						phoneNumber: Joi.string(),
						email: Joi.string().email(),
						mobileNumber: Joi.string().min(8).max(15),
						currentAddress: Joi.object().keys({
							address: Joi.string().max(300),
							// regionId: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
							// cityId: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
							// regionName: Joi.string().min(1).max(32),
							// cityName: Joi.string().min(1).max(32),
							// barangay: Joi.string().min(1).max(32),
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
						fixedPeriod: Joi.number(),
						loanTerm: Joi.number(),
						rate: Joi.number().max(100),
						monthlyRepayment: Joi.number(),
						hasCoBorrower: Joi.boolean(),
						loanType: Joi.string(),
						loanPercent: Joi.number(),
						loanAmount: Joi.number(),
						propertyValue: Joi.number(),
					}),
					employmentInfo: Joi.object().keys({
						tin: Joi.string(),
						companyName: Joi.string().min(1).max(300),
						sss: Joi.string(),
						officePhone: Joi.string(),
						officeEmail: Joi.string(),
						officeAddress: Joi.string().max(300),
						companyIndustry: Joi.string().valid([
							Constant.DATABASE.INDUSTRY.AGRI_FOREST_FISH,
							Constant.DATABASE.INDUSTRY.ACCOMOD_FOOD_SERVICES,
							Constant.DATABASE.INDUSTRY.ARTS_ENTERTAINMENT_RECREATION,
							Constant.DATABASE.INDUSTRY.COMMUNICATION,
							Constant.DATABASE.INDUSTRY.CONSTRUCTION,
							Constant.DATABASE.INDUSTRY.EDUCATION,
							Constant.DATABASE.INDUSTRY.IT,
							Constant.DATABASE.INDUSTRY.OTHERS,
						]),
						// cityId: Joi.string().regex(/^[0-9a-fA-F]{24}$/),      // Refer to city schema
						// cityName: Joi.string(),
						// regionId: Joi.string().regex(/^[0-9a-fA-F]{24}$/), // Refer to region schema
						// regionName: Joi.string(),
						// barangay: Joi.string(),
						// country: Joi.string(),
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
								Constant.DATABASE.INDUSTRY.AGRI_FOREST_FISH,
								Constant.DATABASE.INDUSTRY.ACCOMOD_FOOD_SERVICES,
								Constant.DATABASE.INDUSTRY.ARTS_ENTERTAINMENT_RECREATION,
								Constant.DATABASE.INDUSTRY.COMMUNICATION,
								Constant.DATABASE.INDUSTRY.CONSTRUCTION,
								Constant.DATABASE.INDUSTRY.EDUCATION,
								Constant.DATABASE.INDUSTRY.IT,
								Constant.DATABASE.INDUSTRY.OTHERS,
							]),
							officePhone: Joi.number(),
							officeEmail: Joi.string().email(),
							officeAddress: Joi.string().max(300),
							// cityId: Joi.string().regex(/^[0-9a-fA-F]{24}$/),     // Refer to city schema
							// cityName: Joi.string(),
							// regionId: Joi.string().regex(/^[0-9a-fA-F]{24}$/), // Refer to region schema
							// regionName: Joi.string(),
							// barangay: Joi.string(),
							// country: Joi.string(),
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
							// regionId: Joi.string().regex(/^[0-9a-fA-F]{24}$/), // Refer to region schema
							// cityId: Joi.string().regex(/^[0-9a-fA-F]{24}$/),     // Refer to city schema
							// regionName: Joi.string(),
							// cityName: Joi.string(),
							// barangay: Joi.string(),
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
				// const userData = request.auth && request.auth.credentials && (request.auth.credentials as any).userData;
				const data = await LoanController.loanShuffle();
				return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.DEFAULT, data));
				// return UniversalFunctions. (Constant.STATUS_MSG.SUCCESS.S200.DEFAULT, data);
			} catch (error) {
				UniversalFunctions.consolelog('error', error, true);
				return (UniversalFunctions.sendError(error));
			}
		},
		options: {
			description: 'get abnk images data shufedl',
			tags: ['api', 'anonymous', 'user', 'shuffle', 'banks'],
			auth: 'UserAuth',
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
];