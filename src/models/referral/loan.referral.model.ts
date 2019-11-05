
import { Schema, model, Model, Types, Document } from 'mongoose';
import { LoanReferralDocument } from './referral.document';

export const referralSchema = new Schema({
    firstName: { type: Schema.Types.String },
    lastName: { type: Schema.Types.String },
    email: { type: Schema.Types.String },
    phoneNumber: { type: Schema.Types.String },
    notes: { type: Schema.Types.String },
    userId: { type: Schema.Types.ObjectId },
    createdAt: { type: Number, required: true, default: new Date().getTime() },
    updatedAt: { type: Number, required: true, default: new Date().getTime() },
});

// export let LoanReferral: Model<CityDocument> = model ('')
export const LoanReferral: Model<LoanReferralDocument> = model('referral', referralSchema);
