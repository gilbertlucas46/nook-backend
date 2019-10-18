import { Schema, Document, model } from 'mongoose';
import * as Constant from '../constants';

export interface IHelpCenter extends Document {
    title: string;
    userId: string;
    description: string;
    userRole: number;
    createdAt: number;
    updatedAt: number;
    imageUrl: string;
    categoryId: number;
    categoryType: string;
}

export interface IHelpFulHelpCenter extends Document {
    // userId: string;
    // userRole: number;
    helpCenterId: string;
    ipAddress: string;
    createdAt: number;
    updatedAt: number;
}

const HelpFulHelpCenterSchema = new Schema({
    _id: { type: Schema.Types.ObjectId, required: true, auto: true },
    helpCenterId: { type: Schema.Types.ObjectId, required: true, ref: 'helpcenter' },
    ipAddress: { type: String, required: true, index: true },
    createdAt: { type: Number, required: true },
    updatedAt: { type: Number, required: true },
    likesCount: { type: Number, default: 0 },
    disLikesCount: { type: Number, default: 0 },
});

export let HelpfulHelCenter = model<IHelpFulHelpCenter>('helpfulHelpCenter', HelpFulHelpCenterSchema);

const helpCenterSchema = new Schema({
    _id: { type: Schema.Types.ObjectId, required: true, auto: true },
    title: { type: String },
    videoUrl: { type: String },
    userId: { type: Schema.Types.ObjectId, required: true },
    userRole: {
        type: String,
        enum: [
            Constant.DATABASE.USER_TYPE.ADMIN.TYPE,
            Constant.DATABASE.USER_TYPE.STAFF.TYPE,
        ],
    },
    description: { type: String },
    categoryId: {
        type: Number,
        enum: [
            Constant.DATABASE.HELP_CENTER_TYPE.ACCOUNT.NUMBER,
            Constant.DATABASE.HELP_CENTER_TYPE.BILLING.NUMBER,
            Constant.DATABASE.HELP_CENTER_TYPE.HOME_LOANS.NUMBER,
            Constant.DATABASE.HELP_CENTER_TYPE.PROPERTIES.NUMBER,
        ],
    },
    categoryType: {
        type: String,
        enum: [
            Constant.DATABASE.HELP_CENTER_TYPE.ACCOUNT.TYPE,
            Constant.DATABASE.HELP_CENTER_TYPE.BILLING.TYPE,
            Constant.DATABASE.HELP_CENTER_TYPE.HOME_LOANS.TYPE,
            Constant.DATABASE.HELP_CENTER_TYPE.PROPERTIES.TYPE,
        ],
    },
    actions: [{
        userRole: { type: String },
        userId: { type: String },
        actionTime: { type: Number },
    }],
    createdAt: { type: Number, required: true },
    updatedAt: { type: Number, required: true },
});

export let HelpCentre = model<IHelpCenter>('helpcenter', helpCenterSchema);
