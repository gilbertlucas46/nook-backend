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
        unique: true,
        required: true,
    },
    subscriptionType: { type: String, enum: ['Monthly', 'Yearly'] },
    amount: { type: Number, default: 900 },
    description: { type: String },
    status: { type: String },
    startDate: { type: Number }, // for the admin
    createdAt: { type: Number, required: true },
    updatedAt: { type: Number, required: true },
}, {
        versionKey: false,
    });

export const AdminSubscription = model<IAdminSubscription>('AdminSubscription', adminSubcription);
