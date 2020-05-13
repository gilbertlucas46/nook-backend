
import { Schema, Document, model, Types } from 'mongoose';
import * as CONSTANT from './../../constants';
import { EMPLOYMENT_TYPE, EMPLOYMENT_RANK, EMPLOYMENT_TENURE, LOAN_PROPERTY_TYPES, LOAN_PROPERTY_STATUS, NATIONALITY, CREDIT_CARD_STATUS } from './../../constants';
import { join } from 'path';

const prequalification = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', index: true, required: true },
    email: { type: String, required: true },
    grossIncome: { type: Number }, // 98765433
    property: {
        value: { type: Number },
        type: {
            type: String, enum: [
                LOAN_PROPERTY_TYPES.APARTMENT.value,
                LOAN_PROPERTY_TYPES.CONDOMINIUM.value,
                LOAN_PROPERTY_TYPES.HOUSE_LOT.value,
                LOAN_PROPERTY_TYPES.TOWNHOUSE.value,
                LOAN_PROPERTY_TYPES.VACANT_LOT.value,
            ],
        },
        status: {
            type: String, enum: [
                LOAN_PROPERTY_STATUS.FORECLOSED.value,
                LOAN_PROPERTY_STATUS.REFINANCING.value,
                LOAN_PROPERTY_STATUS.PRE_SELLING.value,
                LOAN_PROPERTY_STATUS.READY_FOR_OCCUPANCY.value,
                LOAN_PROPERTY_STATUS.RESELLING.value,
                LOAN_PROPERTY_STATUS.NEW_CONSTRUCTION.value,
                LOAN_PROPERTY_STATUS.RENOVATION.value,
            ],
            required: true,
        },
        developer: { type: String },
    },
    // work: {
    //     type: {
    //         type: Schema.Types.String, enum: [
    //             EMPLOYMENT_TYPE.BPO.value,
    //             EMPLOYMENT_TYPE.GOVT.value,
    //             EMPLOYMENT_TYPE.OFW.value,
    //             EMPLOYMENT_TYPE.PRIVATE.value,
    //             EMPLOYMENT_TYPE.PROFESSIONAL.value,
    //             EMPLOYMENT_TYPE.SELF.value,
    //         ],
    //         required: true,
    //     },
    //     rank: {
    //         type: Schema.Types.String, enum: [
    //             EMPLOYMENT_RANK.ASSISSTANT_VICE_PRESIDENT.value,
    //             EMPLOYMENT_RANK.ASSISTANT_MANAGER.value,
    //             EMPLOYMENT_RANK.CHAIRMAN.value,
    //             EMPLOYMENT_RANK.CHIEF_EXECUTIVE_OFFICER.value,
    //             EMPLOYMENT_RANK.CLERK.value,
    //             EMPLOYMENT_RANK.DIRECTOR.value,
    //             EMPLOYMENT_RANK.EXECUTIVE_VICE_PRESIDENT.value,
    //             EMPLOYMENT_RANK.FIRST_VICE_PRESIDENT.value,
    //             EMPLOYMENT_RANK.GENERAL_EMPLOYEE.value,
    //             EMPLOYMENT_RANK.MANAGER.value,
    //             EMPLOYMENT_RANK.NON_PROFESIONNAL.value,
    //             EMPLOYMENT_RANK.OWNER.value,
    //             EMPLOYMENT_RANK.PRESIDENT.value,
    //             EMPLOYMENT_RANK.PROFESSIONAL.value,
    //             EMPLOYMENT_RANK.RANK_FILE.value,
    //             EMPLOYMENT_RANK.SENIOR_ASSISTANT_MANAGER.value,
    //             EMPLOYMENT_RANK.SENIOR_ASSISTANT_VICE_PRESIDENT.value,
    //             EMPLOYMENT_RANK.SENIOR_MANAGER.value,
    //             EMPLOYMENT_RANK.SENIOR_VICE_PRESIDENT.value,
    //             EMPLOYMENT_RANK.SUPERVISOR.value,
    //             EMPLOYMENT_RANK.VICE_PRESIDENT.value,
    //         ],
    //         required: true,
    //     },
    //     tenure: { type: String }, // Joi.string().valid(Object.keys(EMPLOYMENT_TENURE)),
    //     income: { type: Number },  // Joi.number().min(25000),
    // },
    employmentInfo: {
        type: {
            type: Schema.Types.String, enum: [
                EMPLOYMENT_TYPE.BPO.value,
                EMPLOYMENT_TYPE.GOVT.value,
                EMPLOYMENT_TYPE.OFW.value,
                EMPLOYMENT_TYPE.PRIVATE.value,
                EMPLOYMENT_TYPE.PROFESSIONAL.value,
                EMPLOYMENT_TYPE.SELF.value,
            ],
            required: true,
        },
        rank: {
            type: Schema.Types.String, enum: [
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
            ],
            required: true,
        },
        tenure: { type: String }, // Joi.string().valid(Object.keys(EMPLOYMENT_TENURE)),
        income: { type: Number },  // Joi.number().min(25000),
    },
    other: {
        type: {
            dob: { type: Number },
            age: { type: Number },
            nationality: {
                type: String, enum: [
                    NATIONALITY.FILIPINO.value,
                    NATIONALITY.FOREIGNER.value,
                ]
            }
        },

        localVisa: { type: Boolean },
        creditCard: {
            status: {
                type: String, enum: [
                    CREDIT_CARD_STATUS.YES.value,
                    CREDIT_CARD_STATUS.NO.value,
                    CREDIT_CARD_STATUS.NOT_NOW.value,
                ],
            },
        },
        limit: { type: Number },
        cancelled: { type: Boolean },
        prevLoans: {
            status: { type: Boolean },
            monthlyTotal: { type: Boolean },
            remainingTotal: { type: Number },
        },

        otherIncome: {
            status: { type: Boolean },
            monthlyIncome: { type: Number },
        },
        married: {
            status: { type: Boolean },
            spouseMonthlyIncome: { type: Number },
        },
        coBorrower: {
            status: { type: Boolean },
            coBorrowerMonthlyIncome: { type: Number },
        },
    },
    totalLoanMonthly: { type: Number }, // 437200.5250656446
    monthlyPayment: { type: Number }, // 437200.5250656446

    loan: {
        type: { type: String },
        term: { type: Number },
        percent: { type: Number },
        amount: { type: Number },
        fixingPeriod: { type: Number },
    }
    ,
    prequalifiedBanks: [{
        isApplied: { type: Boolean },
        abbrevation: { type: String },   //  "BPI"
        bankFeeAmount: { type: Number },
        bankFeePercent: { type: String }, // "up to 2%"  // constant to be made
        bankId: { type: Schema.Types.ObjectId, ref: 'Banks', index: true, required: true },
        bankName: { type: String },   // "BPI Family Savings Bank"
        bannerUrl: { type: String },  // "/assets/banking/bpi-bank/banner.jpg"
        debtIncomePercentRatio: { type: Number },  // 0.4426655275896422
        debtIncomeRatio: { type: Number }, // 40
        fixingPeriod: { type: Number }, // 1
        grossIncome: { type: Number }, // 98765433
        headquarterLocation: { type: String }, // "Makati"
        iconUrl: { type: String },   //  "/assets/banking/bpi-bank/icon.jpg"
        interestRate: { type: Number }, // 5.88
        loanApplicationFeeAmount: { type: Number }, // 0
        loanApplicationFeePercent: { type: Number }, // 0
        loanDurationMonthly: { type: Number }, // 24
        loanDurationYearly: { type: Number }, // 2
        loanForCancelledCreditCard: { type: Boolean }, // true
        loanableAmount: { type: Number }, // 9876542
        logoUrl: { type: String }, // "/assets/banking/bpi-bank/logo.jpg"
        maxLoanDurationAllowed: { type: Number }, // 20
        monthlyPayment: { type: Number }, // 437200.5250656446
        processingTime: { type: String },  // "As fast as 5 working days upon submission of complete documents"
        totalLoanMonthly: { type: Number }, // 437200.5250656446
    }],
    status: {
        type: String, enum: [
            CONSTANT.DATABASE.PREQUALIFICATION_STATUS.PENDING,
            CONSTANT.DATABASE.PREQUALIFICATION_STATUS.ACTIVE,
            CONSTANT.DATABASE.PREQUALIFICATION_STATUS.BLOCK,
        ], index: true,
        default: CONSTANT.DATABASE.PREQUALIFICATION_STATUS.ACTIVE,
    },
    createdAt: { type: Number },
    updatedAt: { type: Number },
    referenceId: { type: String },
});
// schema.pre('save', function (this: any, next: () => void) {
//     if (!this.referenceId) {
//         this.referenceId = `USR${++global.counters.LoanApplication}`;
//     }
//     next();
// });

export const PreQualification = model('prequalification', prequalification);
