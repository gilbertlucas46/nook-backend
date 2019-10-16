import { Schema, model } from 'mongoose';
import { LOAN_PROPERTY_TYPES, LOAN_PROPERTY_STATUS } from '../../constants';

const bankSchema = new Schema({
    _id: { type: Schema.Types.ObjectId, required: true, auto: true },
    userEmploymentCriteria: { type: Schema.Types.ObjectId, required: true, index: true, ref: 'UserEmployment' },
    abbrevation: { type: String },
    bankName: { type: String },
    headquarters: { type: String },
    propertySpecification: [
        {
            allowedPropertyType: {
                type: String,
                enum: [
                    LOAN_PROPERTY_TYPES.VACANT_LOT.value,
                    LOAN_PROPERTY_TYPES.CONDOMINIUM.value,
                    LOAN_PROPERTY_TYPES.HOUSE_LOT.value,
                    LOAN_PROPERTY_TYPES.TOWNHOUSE.value,
                    LOAN_PROPERTY_TYPES.VACANT_LOT.value,
                ],
            },
            allowedPropertyStatus: {
                type: String,
                enum: [
                    LOAN_PROPERTY_STATUS.FORECLOSED.value,
                    LOAN_PROPERTY_STATUS.REFINANCING.value,
                    LOAN_PROPERTY_STATUS.PRE_SELLING.value,
                    LOAN_PROPERTY_STATUS.READY_FOR_OCCUPANCY.value,
                    LOAN_PROPERTY_STATUS.RESELLING.value,
                ],
            },
            maxLoanDurationAllowed: {
                type: Number,
            },
        },
    ],
    interestRateDetails: [
        {
            fixedPeriod: { type: Schema.Types.Number, min: 1, max: 30, trim: true },
            interestRate: { type: Schema.Types.Number },
        },
    ],
    loanProcessingFees: {
        type: Number,                 // Percentage
        default: 0,
    },
    minAmount: {                      // In PHP
        type: Number,
        default: 50000,
    },
    maxAmount: {
        type: Number,
        default: 1000000000,
    },
    minLoanDuration: {                  // Months
        type: Number,
        default: 12,
    },
    maxLoanDuration: {
        type: Number,
        default: 360,
    },
    loanForForeigner: {
        type: Boolean,
        default: false,
    },
    loanForForeignerMarriedToLocal: {
        type: Boolean,
        default: true,
    },
    loanForNonCreditCardHolder: {
        type: Boolean,
        default: false,
    },
    loanForCreditCardHolder: {
        type: Boolean,
        default: true,
    },
    loanForNotNowCreditCardHolder: {
        type: Boolean,
        default: true,
    },
    minAgeRequiredForLoan: {
        type: Number,
        default: 21,
    },
    maxAgeTillLoanCompleted: {
        type: Number,
        default: 65,
    },
    loanIfAlreadyExistLoanForDifferentBank: {
        type: Boolean,
        default: true,
    },
    loanIfAlreadyExistLoanForSameBank: {
        type: Boolean,
        default: true,
    },
    minMonthlyIncomeForLoan: {
        type: Number,
        default: 50000,
    },
    loanForMissedLoanPayment: {
        type: Boolean,
        default: false,
    },
    bankImageLogoUrl: { type: String },
    createdAt: { type: Number, required: true },
    updatedAt: { type: Number, required: true },
});

export const Bank = model('banks', bankSchema);