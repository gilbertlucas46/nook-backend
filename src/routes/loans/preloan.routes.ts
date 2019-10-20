import { ServerRoute, ResponseToolkit } from 'hapi';
import * as Joi from 'joi';
import * as UniversalFunctions from '@src/utils';
import * as Constant from '@src/constants/app.constant';
import { LOAN_PROPERTY_TYPES, LOAN_PROPERTY_STATUS, EMPLOYMENT_TYPE, EMPLOYMENT_RANK, CREDIT_CARD_STATUS, EMPLOYMENT_TENURE } from '@src/constants';
import { LoanRequest } from '@src/interfaces/loan.interface';
import { LoanController } from '@src/controllers/loan/loan.controller';

export let preloanRoute: ServerRoute[] = [
  {
    method: 'PATCH',
    path: '/v1/user/loan/pre-application',
    handler: async (request, h: ResponseToolkit) => {
      try {
        const payload: LoanRequest.PreLoan = request.payload as LoanRequest.PreLoan;
        const bankData = await LoanController.checkPreloanApplication(payload);
        return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S201.CREATED, bankData));
      } catch (error) {
        return (UniversalFunctions.sendError(error));
      }
    },
    options: {
      description: 'Get pre Loan Requirements',
      tags: ['api', 'anonymous', 'loan'],
      // auth: 'UserAuth',
      validate: {
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
            ]).required(),
            developer: Joi.string(),
          }),

          work: Joi.object().keys({
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

            tenure: Joi.string().valid([
              EMPLOYMENT_TENURE['0_1'].value,
              EMPLOYMENT_TENURE['1_2'].value,
              EMPLOYMENT_TENURE['2_3'].value,
              EMPLOYMENT_TENURE['3_100'].value,

            ]),
            income: Joi.number().min(25000),
          }),

          other: Joi.object().keys({
            age: Joi.number().min(21).max(65),
            nationality: Joi.string(),
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
            term: Joi.number(),
            percent: Joi.number(),
            amount: Joi.number(),
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