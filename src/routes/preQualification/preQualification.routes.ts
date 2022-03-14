import { ServerRoute } from 'hapi';
import * as UniversalFunction from '../../utils';
import { PreQualificationService } from '@src/controllers/preQualification/preQualification.controller';
import * as UniversalFunctions from '../../utils';
import * as Constant from '../../constants';
import * as Joi from 'joi';
import { PreQualificationRequest } from '@src/interfaces/preQualification.interface';
// import { LOAN_PROPERTY_TYPES, LOAN_PROPERTY_STATUS } from '../../constants';
import { LOAN_PROPERTY_TYPES, LOAN_PROPERTY_STATUS, EMPLOYMENT_TYPE, EMPLOYMENT_RANK, CREDIT_CARD_STATUS, EMPLOYMENT_TENURE, NATIONALITY } from '@src/constants';
import { UserService } from '@src/controllers';

const objectSchema = Joi.object({
    // accessLevel: Joi.number().valid([CONSTANT.PRIVILEGE.SUB_ADMIN_PRIVILEGE]).default(2),
    abbrevation: Joi.string(), // "CTBC",
    bankName: Joi.string(), // "CTBC Bank",
    headquarterLocation: Joi.string(), // "Taiwan",
    loanForCancelledCreditCard: Joi.boolean(), // true,
    bankFeeAmount: Joi.number(), // 0,
    loanApplicationFeePercent: Joi.number(), // 0,
    logoUrl: Joi.string(), // "/assets/banking/ctbc-bank/logo.png",
    iconUrl: Joi.string(), // "/assets/banking/ctbc-bank/icon.jpg",
    bannerUrl: Joi.string(), //  "/assets/banking/ctbc-bank/banner.jpg",
    interestRate: Joi.number(), // 7,
    loanableAmount: Joi.number(), // 1876542,
    loanDurationYearly: Joi.number(), // 2,
    loanApplicationFeeAmount: Joi.number(), // 0,
    fixingPeriod: Joi.number(), // 1,
    grossIncome: Joi.number(), // 98765432,
    loanDurationMonthly: Joi.number(), // 24,
    bankFeePercent: Joi.string(), // "up to 2%",
    processingTime: Joi.string(), // "As fast as 5 working days upon submission of complete documents",
    totalLoanMonthly: Joi.number(), // 84017.6251353744,
    monthlyPayment: Joi.number(), // 84017.6251353744,
    bankId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),                    // ObjectId("5da840c71591fd46673194b3"),
    debtIncomePercentRatio: Joi.number(), // 0.0850678455346345,
    debtIncomeRatio: Joi.number(), // 30,
    maxLoanDurationAllowed: Joi.number(), // 20
});

export let preQualificationroutes: ServerRoute[] = [
    {
        method: 'POST',
        path: '/v1/user/prequalification',
        handler: async (request, h) => {
            try {
                const userData = request.auth && request.auth.credentials && (request.auth.credentials as any).userData;
                const payload: PreQualificationRequest.IPreLoanAdd = request.payload as any;

                const data = await PreQualificationService.addPreQualifiedBanks(payload, userData);
                return UniversalFunction.sendSuccess(Constant.STATUS_MSG.SUCCESS.S201.PREQUALIFICATION_SAVED, {});
            } catch (error) {
                UniversalFunctions.consolelog(error, 'error', true);
                UniversalFunctions.errorReporter(error);
                return (UniversalFunction.sendError(error));
            }
        },
        options: {
            description: 'user prqualification Bank ',
            tags: ['api', 'anonymous', 'user', 'bank', 'add', 'prequalification'],
            auth: 'UserAuth',
            validate: {
                payload: {
                    preQualificationId: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
                    partnerName: Joi.string(),
                    partnerId: Joi.string(),
                    property: Joi.object().keys({
                        value: Joi.number().min(50000),
                        type: Joi.string().valid([
                            LOAN_PROPERTY_TYPES.APARTMENT.value,
                            LOAN_PROPERTY_TYPES.CONDOMINIUM.value,
                            LOAN_PROPERTY_TYPES.HOUSE_LOT.value,
                            LOAN_PROPERTY_TYPES.TOWNHOUSE.value,
                            LOAN_PROPERTY_TYPES.VACANT_LOT.value,
                        ]).required(),
                        status: Joi.string().valid([
                            LOAN_PROPERTY_STATUS.FORECLOSED.value,
                            LOAN_PROPERTY_STATUS.REFINANCING.value,
                            LOAN_PROPERTY_STATUS.PRE_SELLING.value,
                            LOAN_PROPERTY_STATUS.READY_FOR_OCCUPANCY.value,
                            LOAN_PROPERTY_STATUS.RENOVATION.value,
                            LOAN_PROPERTY_STATUS.RESELLING.value,
                            LOAN_PROPERTY_STATUS.NEW_CONSTRUCTION.value,

                        ]).required(),
                        developer: Joi.string(),
                    }),

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
                        ]).required(),

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

                        tenure: Joi.string().valid(Object.keys(EMPLOYMENT_TENURE)),
                        income: Joi.number().min(25000),
                    }),

                    other: Joi.object().keys({
                        dob: Joi.string(),
                        age: Joi.number().min(21).max(70),
                        nationality: Joi.string().valid([
                            NATIONALITY.FILIPINO.value,
                            NATIONALITY.FOREIGNER.value,
                        ]),
                        localVisa: Joi.boolean(),
                        creditCard: Joi.object().keys({
                            status: Joi.string().valid([
                                CREDIT_CARD_STATUS.YES.value,
                                CREDIT_CARD_STATUS.NO.value,
                                CREDIT_CARD_STATUS.NOT_NOW.value,
                            ]),
                            limit: Joi.number(),
                            cancelled: Joi.boolean(),
                        }),
                        prevLoans: Joi.object().keys({
                            status: Joi.boolean(),
                            monthlyTotal: Joi.number(),
                            remainingTotal: Joi.number(),
                        }),
                        otherIncome: Joi.object().keys({
                            status: Joi.boolean(),
                            monthlyIncome: Joi.number(),
                        }),
                        married: {
                            status: Joi.boolean(),
                            spouseMonthlyIncome: Joi.number(),
                        },
                        coBorrower: {
                            status: Joi.boolean(),
                            coBorrowerMonthlyIncome: Joi.number(),
                        },
                        mobileNumber: Joi.string().trim(),
                    }),

                    loan: Joi.object().keys({
                        type: Joi.string(),
                        term: Joi.number(),
                        percent: Joi.number(),
                        amount: Joi.number(),
                        fixingPeriod: Joi.number(),
                    }),

                    // prequalifiedBanks: Joi.array().items(objectSchema),
                },
                headers: UniversalFunctions.authorizationHeaderObj,
                failAction: UniversalFunctions.failActionFunction,
            },
        },
    },
    /**
     * @description user get preQulification loan list
     */

    {
        method: 'GET',
        path: '/v1/user/prequalification',
        handler: async (request, h) => {
            try {
                const userData = request.auth && request.auth.credentials && (request.auth.credentials as any).userData;
                const payload: PreQualificationRequest.IPrequalificationList = request.query as any;

                const data = await PreQualificationService.getPreQualifiedBanks(payload, userData);
                return UniversalFunction.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.DEFAULT, data);
            } catch (error) {
                UniversalFunctions.consolelog(error, 'error', true);
                return (UniversalFunction.sendError(error));
            }
        },
        options: {
            description: 'user prqualification Bank list ',
            tags: ['api', 'anonymous', 'user', 'bank', 'list', 'prequalification'],
            auth: 'UserAuth',
            validate: {
                query: {
                    limit: Joi.number(),
                    page: Joi.number(),
                    sortType: Joi.number().valid([Constant.ENUM.SORT_TYPE]),
                    sortBy: Joi.string().default('date'),
                    fromDate: Joi.number(),
                    toDate: Joi.number(),
                },
                headers: UniversalFunctions.authorizationHeaderObj,
                failAction: UniversalFunctions.failActionFunction,
            },
        },
    },

    {
        method: 'GET',
        path: '/v1/user/prequalification/{id}',
        handler: async (request, h) => {
            try {
                const userData = request.auth && request.auth.credentials && (request.auth.credentials as any).userData;
                const payload = request.params as any;

                const data = await PreQualificationService.preQualificationById(payload, userData);
                return UniversalFunction.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.DEFAULT, data);
            } catch (error) {
                UniversalFunctions.consolelog(error, 'error', true);
                return (UniversalFunction.sendError(error));
            }
        },
        options: {
            description: 'user prqualification Bank list by id',
            tags: ['api', 'anonymous', 'user', 'bank', 'list', 'prequalification'],
            auth: 'UserAuth',
            validate: {
                params: {
                    // limit: Joi.number(),
                    id: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
                },
                headers: UniversalFunctions.authorizationHeaderObj,
                failAction: UniversalFunctions.failActionFunction,
            },
        },
    },

    {
        method: 'PATCH',
        path: '/v1/user/prequalification',
        handler: async (request, h) => {
            try {
                const userData = request.auth && request.auth.credentials && (request.auth.credentials as any).userData;
                const payload: PreQualificationRequest.IPreLoanAdd = request.payload as any;

                const data = await PreQualificationService.addPreQualifiedBanks(payload, userData);
                return UniversalFunction.sendSuccess(Constant.STATUS_MSG.SUCCESS.S201.PREQUALIFICATION_SAVED, {});
            } catch (error) {
                UniversalFunctions.consolelog(error, 'error', true);
                UniversalFunctions.errorReporter(error);
                return (UniversalFunction.sendError(error));
            }
        },
        options: {
            description: 'user prqualification Bank ',
            tags: ['api', 'anonymous', 'user', 'bank', 'add', 'prequalification'],
            auth: 'UserAuth',
            validate: {
                payload: {
                    preQualificationId: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
                    property: Joi.object().keys({
                        value: Joi.number().min(50000),
                        type: Joi.string().valid([
                            LOAN_PROPERTY_TYPES.APARTMENT.value,
                            LOAN_PROPERTY_TYPES.CONDOMINIUM.value,
                            LOAN_PROPERTY_TYPES.HOUSE_LOT.value,
                            LOAN_PROPERTY_TYPES.TOWNHOUSE.value,
                            LOAN_PROPERTY_TYPES.VACANT_LOT.value,
                        ]).required(),
                        status: Joi.string().valid([
                            LOAN_PROPERTY_STATUS.FORECLOSED.value,
                            LOAN_PROPERTY_STATUS.REFINANCING.value,
                            LOAN_PROPERTY_STATUS.PRE_SELLING.value,
                            LOAN_PROPERTY_STATUS.READY_FOR_OCCUPANCY.value,
                            LOAN_PROPERTY_STATUS.RENOVATION.value,
                            LOAN_PROPERTY_STATUS.RESELLING.value,
                            LOAN_PROPERTY_STATUS.NEW_CONSTRUCTION.value,

                        ]).required(),
                        developer: Joi.string(),
                    }),

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
                        ]).required(),

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
                        ]).required(),

                        tenure: Joi.string().valid(Object.keys(EMPLOYMENT_TENURE)),
                        income: Joi.number().min(25000),
                    }),

                    other: Joi.object().keys({
                        dob: Joi.string(),
                        age: Joi.number().min(21).max(65),
                        nationality: Joi.string().valid([
                            NATIONALITY.FILIPINO.value,
                            NATIONALITY.FOREIGNER.value,
                        ]),
                        localVisa: Joi.boolean(),
                        creditCard: Joi.object().keys({
                            status: Joi.string().valid([
                                CREDIT_CARD_STATUS.YES.value,
                                CREDIT_CARD_STATUS.NO.value,
                                CREDIT_CARD_STATUS.NOT_NOW.value,
                            ]),
                            limit: Joi.number(),
                            cancelled: Joi.boolean(),
                        }),
                        prevLoans: Joi.object().keys({
                            status: Joi.boolean(),
                            monthlyTotal: Joi.number(),
                            remainingTotal: Joi.number(),
                        }),
                        otherIncome: Joi.object().keys({
                            status: Joi.boolean(),
                            monthlyIncome: Joi.number(),
                        }),
                        married: {
                            status: Joi.boolean(),
                            spouseMonthlyIncome: Joi.number(),
                        },
                        coBorrower: {
                            status: Joi.boolean(),
                            coBorrowerMonthlyIncome: Joi.number(),
                        },
                        mobileNumber: Joi.string().trim(),
                    }),

                    loan: Joi.object().keys({
                        type: Joi.string(),
                        term: Joi.number(),
                        percent: Joi.number(),
                        amount: Joi.number(),
                        fixingPeriod: Joi.number(),
                    }),

                    // prequalifiedBanks: Joi.array().items(objectSchema),
                },
                headers: UniversalFunctions.authorizationHeaderObj,
                failAction: UniversalFunctions.failActionFunction,
            },
        },
    },

    /**
     * @description admin add prequalification
     */

    {
        method: 'POST',
        path: '/v1/admin/prequalification',
        handler: async (request, h) => {
            try {
                const adminData = request.auth && request.auth.credentials && (request.auth.credentials as any).adminData;
                const payload: PreQualificationRequest.IPreLoanAdd = request.payload as any;

                const data = await PreQualificationService.adminAddPreQualifiedBanks(payload, adminData);
                return UniversalFunction.sendSuccess(Constant.STATUS_MSG.SUCCESS.S201.PREQUALIFICATION_SAVED, data);
            } catch (error) {
                UniversalFunctions.consolelog(error, 'error', true);
                return (UniversalFunction.sendError(error));
            }
        },
        options: {
            description: 'Admin prqualification Bank ',
            tags: ['api', 'anonymous', 'user', 'bank', 'add', 'prequalification'],
            auth: 'AdminAuth',
            validate: {
                payload: {
                    preQualificationId: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
                    partnerName: Joi.string().allow(''),
                    partnerId: Joi.string().allow(''),
                    userId: Joi.string().regex(/^[0-9a-fA-F]{24}$/), // to add the prequialification for the user by admin
                    property: Joi.object().keys({
                        value: Joi.number().min(50000),
                        type: Joi.string().valid([
                            LOAN_PROPERTY_TYPES.APARTMENT.value,
                            LOAN_PROPERTY_TYPES.CONDOMINIUM.value,
                            LOAN_PROPERTY_TYPES.HOUSE_LOT.value,
                            LOAN_PROPERTY_TYPES.TOWNHOUSE.value,
                            LOAN_PROPERTY_TYPES.VACANT_LOT.value,
                        ]).required(),
                        status: Joi.string().valid([
                            LOAN_PROPERTY_STATUS.FORECLOSED.value,
                            LOAN_PROPERTY_STATUS.REFINANCING.value,
                            LOAN_PROPERTY_STATUS.PRE_SELLING.value,
                            LOAN_PROPERTY_STATUS.READY_FOR_OCCUPANCY.value,
                            LOAN_PROPERTY_STATUS.RENOVATION.value,
                            LOAN_PROPERTY_STATUS.RESELLING.value,
                            LOAN_PROPERTY_STATUS.NEW_CONSTRUCTION.value,

                        ]).required(),
                        developer: Joi.string(),
                    }),

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
                        ]).required(),

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
                        ]).required(),

                        tenure: Joi.string().valid(Object.keys(EMPLOYMENT_TENURE)),
                        income: Joi.number().min(25000),
                    }),

                    other: Joi.object().keys({
                        dob: Joi.string(),
                        age: Joi.number().min(21).max(70),
                        nationality: Joi.string().valid([
                            NATIONALITY.FILIPINO.value,
                            NATIONALITY.FOREIGNER.value,
                        ]),
                        localVisa: Joi.boolean(),
                        creditCard: Joi.object().keys({
                            status: Joi.string().valid([
                                CREDIT_CARD_STATUS.YES.value,
                                CREDIT_CARD_STATUS.NO.value,
                                CREDIT_CARD_STATUS.NOT_NOW.value,
                            ]),
                            limit: Joi.number(),
                            cancelled: Joi.boolean(),
                        }),
                        prevLoans: Joi.object().keys({
                            status: Joi.boolean(),
                            monthlyTotal: Joi.number(),
                            remainingTotal: Joi.number(),
                        }),
                        otherIncome: Joi.object().keys({
                            status: Joi.boolean(),
                            monthlyIncome: Joi.number(),
                        }),
                        married: {
                            status: Joi.boolean(),
                            spouseMonthlyIncome: Joi.number(),
                        },
                        coBorrower: {
                            status: Joi.boolean(),
                            coBorrowerMonthlyIncome: Joi.number(),
                        },
                        firstName: Joi.string().required(),
                        lastName: Joi.string().required(),
                        middleName: Joi.string().allow(''),
                        // userName: Joi.string().lowercase().required(),
                        email: Joi.string().email().required(),
                        mobileNumber: Joi.string().trim(),
                    }),

                    loan: Joi.object().keys({
                        type: Joi.string(),
                        term: Joi.number(),
                        percent: Joi.number(),
                        amount: Joi.number(),
                        fixingPeriod: Joi.number(),
                    }),
                    // userId: Joi.string(), // in case of co-borrower

                    // prequalifiedBanks: Joi.array().items(objectSchema),
                },
                headers: UniversalFunctions.authorizationHeaderObj,
                failAction: UniversalFunctions.failActionFunction,
            },
        },
    },


    {
        method: 'DELETE',
        path: '/v1/admin/prequalification/{Id}',
        handler: async (request, h) => {
            try {
                const adminData = request.auth && request.auth.credentials && (request.auth.credentials as any).adminData;
                const payload = request.params as any;
                // {
                // 	// ...request.query as any,
                // 	...request.params,
                // }
                // if (adminData.type === Constant.DATABASE.USER_TYPE.STAFF.TYPE) {
                // 	await AdminStaffEntity.checkPermission(payload.permission);
                // }
                const permission = await UniversalFunctions.checkPermission(adminData, Constant.DATABASE.PERMISSION.TYPE.LOAN);

                const registerResponse = await PreQualificationService.adminDeletePrequalification(payload);
                return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.DEFAULT, registerResponse));
            } catch (error) {
                UniversalFunction.errorReporter(error);
                UniversalFunction.consolelog('Error', error, true);
                return (UniversalFunctions.sendError(error));
            }
        },
        options: {
            description: 'Admin update prequlification status',
            tags: ['api', 'anonymous', 'admin', 'loan', 'status'],
            auth: 'AdminAuth',
            validate: {
                params: {
                    Id: Joi.string().required(),
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