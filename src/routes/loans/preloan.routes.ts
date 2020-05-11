import { ServerRoute, ResponseToolkit } from 'hapi';
import * as Joi from 'joi';
import * as UniversalFunctions from '@src/utils';
import * as Constant from '@src/constants/app.constant';
import { LOAN_PROPERTY_TYPES, LOAN_PROPERTY_STATUS, EMPLOYMENT_TYPE, EMPLOYMENT_RANK, CREDIT_CARD_STATUS, EMPLOYMENT_TENURE, NATIONALITY } from '@src/constants';
import { LoanRequest } from '@src/interfaces/loan.interface';
import { LoanController } from '@src/controllers/loan/loan.controller';

export let preloanRoute: ServerRoute[] = [
  {
    method: 'PATCH',
    path: '/v1/user/loan/pre-application',
    handler: async (request, h: ResponseToolkit) => {
      try {
        const userData = request.auth && request.auth.credentials && (request.auth.credentials as any).userData;
        // const payload = request.payload as AdminRequest.ProfileUpdate;

        const payload: LoanRequest.PreLoan = request.payload as LoanRequest.PreLoan;
        console.log('payloadpayload', payload);
        if (request.query.bankId) payload.bankId = request.query.bankId as string;
        const bankData = await LoanController.checkPreloanApplication(payload, userData);
        return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.DEFAULT, bankData));
      } catch (error) {
        UniversalFunctions.consolelog(error, 'error', true);
        return (UniversalFunctions.sendError(error));
      }
    },
    options: {
      description: 'Get pre Loan Requirements',
      tags: ['api', 'anonymous', 'loan'],
      auth: 'DoubleAuth',
      validate: {
        query: {
          bankId: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
        },
        payload: {
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
              LOAN_PROPERTY_STATUS.RESELLING.value,
              LOAN_PROPERTY_STATUS.RENOVATION.value,
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
            age: Joi.number().min(21).max(65),
            dob: Joi.number(),
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
          }),

          loan: Joi.object().keys({
            type: Joi.string(),
            term: Joi.number().default(0),
            percent: Joi.number(),
            amount: Joi.number(),
            fixingPeriod: Joi.number(),
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
   * @description admin prequalification bank listing
   */
  {
    method: 'PATCH',
    path: '/v1/admin/loan/pre-application',
    handler: async (request, h: ResponseToolkit) => {
      try {
        const adminData = request.auth && request.auth.credentials && (request.auth.credentials as any).adminData;
        // const payload = request.payload as AdminRequest.ProfileUpdate;

        const payload: LoanRequest.PreLoan = request.payload as LoanRequest.PreLoan;
        console.log('payloadpayload', payload);
        if (request.query.bankId) payload.bankId = request.query.bankId as string;

        const bankData = await LoanController.checkPreloanApplication(payload, adminData);

        return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.DEFAULT, bankData));
      } catch (error) {
        UniversalFunctions.consolelog(error, 'error', true);
        return (UniversalFunctions.sendError(error));
      }
    },
    options: {
      description: 'Get pre Loan Requirements',
      tags: ['api', 'anonymous', 'loan'],
      auth: 'AdminAuth',
      validate: {
        query: {
          bankId: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
        },
        payload: {
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
              LOAN_PROPERTY_STATUS.RESELLING.value,
              LOAN_PROPERTY_STATUS.RENOVATION.value,
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
            age: Joi.number().min(21).max(65),
            dob: Joi.number(),
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
          }),

          loan: Joi.object().keys({
            type: Joi.string(),
            term: Joi.number().default(0),
            percent: Joi.number(),
            amount: Joi.number(),
            fixingPeriod: Joi.number(),
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

];