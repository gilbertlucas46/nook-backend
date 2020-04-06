import { Schema, Document, model, Types } from 'mongoose';
import * as CONSTANT from './../../constants';
import { EMPLOYMENT_TYPE, EMPLOYMENT_RANK, EMPLOYMENT_TENURE } from './../../constants';

const prequalification = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', index: true, required: true },
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
            CONSTANT.DATABASE.ARTICLE_STATUS.PENDING,
            CONSTANT.DATABASE.ARTICLE_STATUS.ACTIVE,
            CONSTANT.DATABASE.ARTICLE_STATUS.BLOCK,
        ], index: true,
        default: CONSTANT.DATABASE.ARTICLE_STATUS.ACTIVE,
    },
    createdAt: { type: Number },
    updatedAt: { type: Number },

});
// schema.pre('save', function (this: any, next: () => void) {
//     if (!this.referenceId) {
//         this.referenceId = `USR${++global.counters.LoanApplication}`;
//     }
//     next();
// });

export const PreQualification = model('prequalification', prequalification);
