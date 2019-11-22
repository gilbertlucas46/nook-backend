
import { Schema, model, Model, Types, Document } from 'mongoose';
import { LoanReferralDocument } from './referral.document';
import * as Constant from '../../constants';

export const referralSchema = new Schema({
    firstName: { type: Schema.Types.String },
    lastName: { type: Schema.Types.String },
    email: { type: Schema.Types.String },
    phoneNumber: { type: Schema.Types.String },
    notes: { type: Schema.Types.String },
    userId: { type: Schema.Types.ObjectId },
    status: {
        type: String,
        enum: [
            Constant.DATABASE.REFERRAL_STATUS.ACKNOWLEDGE,
            Constant.DATABASE.REFERRAL_STATUS.CONTACTED,
        ],
        default: Constant.DATABASE.REFERRAL_STATUS.PENDING,
    },
    staffStatus: [{
        status: {
            type: String,
            enum: [
                Constant.DATABASE.REFERRAL_STATUS.ACKNOWLEDGE,
                Constant.DATABASE.REFERRAL_STATUS.CONTACTED,
            ],
        },
        staffId: { String },
        seenAt: { Number },
        stafName: { String },
        message: { String },
    }],
    createdAt: { type: Number, required: true, default: new Date().getTime() },
    updatedAt: { type: Number, required: true, default: new Date().getTime() },
}, {
        versionKey: false,
    },
);

export const LoanReferral: Model<LoanReferralDocument> = model('referral', referralSchema);
