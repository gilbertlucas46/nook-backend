import { Schema, Document, Types, model } from 'mongoose';

import * as CONSTANT from '@src/constants/app.constant';

export interface IAdminSubscription extends Document {
    featuredType: string;
    subscriptionType: string;
    amount: number;
    description: string;
    startDate: number;
    createdAt: number;
    updatedAt: number;
}

const adminSubcription = new Schema({
    featuredType: {
        type: String,
        enum: [
            CONSTANT.DATABASE.FEATURED_TYPE.PROFILE,
            CONSTANT.DATABASE.FEATURED_TYPE.PROPERTY,
            CONSTANT.DATABASE.FEATURED_TYPE.HOMEPAGE,
            CONSTANT.DATABASE.FEATURED_TYPE.FREE,
        ],
    },
    plans: [
        {
            billingType: {
                type: String, enum: [
                    CONSTANT.DATABASE.BILLING_TYPE.YEARLY,
                    CONSTANT.DATABASE.BILLING_TYPE.MONTHLY,
                ],
            },
            amount: {
                type: Number,
            },
        },
    ],
    description: { type: String },
    status: { type: String },
    // startDate: { type: Number }, // for the admin
    createdAt: { type: Number, required: true },
    updatedAt: { type: Number, required: true },
}, {

        versionKey: false,
    });
// adminSubcription.index({ featuredType: 1, subscriptionType: 1 }, { unique: true });
export const AdminSubscription = model<IAdminSubscription>('AdminSubscription', adminSubcription);
