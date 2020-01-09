import { Schema, Document, Types, model } from 'mongoose';

import * as CONSTANT from '@src/constants/app.constant';
import { SubscriptionPlan } from './admin.subscription.document';

const adminSubcription = new Schema({
    featuredType: {
        type: String,
        enum: [
            CONSTANT.DATABASE.FEATURED_TYPE.PROFILE,
            CONSTANT.DATABASE.FEATURED_TYPE.PROPERTY,
            CONSTANT.DATABASE.FEATURED_TYPE.HOMEPAGE_PROFILE,
            CONSTANT.DATABASE.FEATURED_TYPE.HOMEPAGE_PROPERTY,
            CONSTANT.DATABASE.FEATURED_TYPE.FREE,
        ],
    },
    plans: [
        {
            planId: { type: String },
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
    createdAt: { type: Number, required: true, default: new Date().getTime() },
    updatedAt: { type: Number, required: true, default: new Date().getTime() },
}, {
        versionKey: false,
    });
export const AdminSubscription = model<SubscriptionPlan>('AdminSubscription', adminSubcription);
