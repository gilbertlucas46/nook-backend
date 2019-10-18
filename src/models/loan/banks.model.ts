import { Schema, model } from 'mongoose';
import { LOAN_PROPERTY_TYPES, LOAN_PROPERTY_STATUS } from '../../constants';

const bankSchema = new Schema({
    _id: { type: Schema.Types.ObjectId, required: true, auto: true },
    abbrevation: { type: String },
    bankName: { type: String },
    headquarterLocation: { type: String },
    propertySpecification: [
        {
            allowedPropertyType: {
                type: String,
                enum: [
                    LOAN_PROPERTY_TYPES.APARTMENT.value,
                    LOAN_PROPERTY_TYPES.CONDOMINIUM.value,
                    LOAN_PROPERTY_TYPES.HOUSE_LOT.value,
                    LOAN_PROPERTY_TYPES.TOWNHOUSE.value,
                    LOAN_PROPERTY_TYPES.VACANT_LOT.value,
                ],
            },
            allowedPropertyStatus: {
                type: [String],
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
            maxLoanPercent: { type: Number, required: true, min: 4, max: 80 },
            debtIncomeRatio: { type: Number, required: true, max: 100 }, // percentage
        },
    ],
    interestRateDetails: { type: Object },
    bankFeePercent: {
        type: Number,
        min: 0,
        max: 100,
    },
    bankFeeAmount: {
        type: Number,
    },
    loanApplicationFeePercent: {
        type: Number,
        min: 0,
        max: 100,
    },
    loanMinAmount: {
        type: Number,
        required: true,
    },
    loanMaxAmount: {
        type: Number,
        max: 1000000000,
        required: true,
    },
    minLoanDuration: {
        type: Number,
        required: true,
        min: 12,
        max: 360,
    },
    maxLoanDuration: {
        type: Number,
        required: true,
        max: 360,
    },
    loanForForeigner: {
        type: Boolean,
        default: false,
    },
    loanForForeignerMarriedLocal: {
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
        min: 21,
    },
    maxAgeTillLoanCompleted: {
        type: Number,
        min: 21,
        max: 65,
    },
    loanAlreadyExistDiffBank: {
        type: Boolean,
        default: true,
    },
    loanAlreadyExistSameBank: {
        type: Boolean,
        default: true,
    },
    minMonthlyIncomeRequired: {
        type: Number,
        required: true,
    },
    missedLoanPaymentAllowance: {
        type: Boolean,
        default: false,
    },
    bankImageLogoUrl: { type: String },
    createdAt: { type: Number, required: true },
    updatedAt: { type: Number, required: true },
});

export const Bank = model('banks', bankSchema);