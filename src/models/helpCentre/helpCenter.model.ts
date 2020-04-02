import { Schema, Document, model } from 'mongoose';
import * as Constant from '../../constants';

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
    action: object[];
}

export interface IHelpFulHelpCenter extends Document {
    // userId: string;
    // userRole: number;
    helpCenterId: string;
    ipAddress: string;
    createdAt: number;
    updatedAt: number;
    isHelpful: boolean;
}

const HelpCenterStatusSchema = new Schema({
    _id: { type: Schema.Types.ObjectId, required: true, auto: true },
    helpCenterId: { type: Schema.Types.ObjectId, required: true, ref: 'helpcenter' },
    ipAddress: { type: String, required: true, index: true },
    createdAt: { type: Number, required: true },
    updatedAt: { type: Number, required: true },
    isHelpful: { type: Boolean },
});

export let HelpCenterStatus = model<IHelpFulHelpCenter>('helpcenterStatus', HelpCenterStatusSchema);

const helpCenterSchema = new Schema({
    _id: { type: Schema.Types.ObjectId, required: true, auto: true },
    title: { type: String, index: true },
    videoUrl: { type: String, allow: '' },
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
            // Constant.DATABASE.HELP_CENTER_TYPE.BILLING.NUMBER,
            Constant.DATABASE.HELP_CENTER_TYPE.HOME_LOANS.NUMBER,
            // Constant.DATABASE.HELP_CENTER_TYPE.PROPERTIES.NUMBER,
            Constant.DATABASE.HELP_CENTER_TYPE.FAQ.NUMBER,

        ],
    },
    categoryType: {
        type: String,
        enum: [
            Constant.DATABASE.HELP_CENTER_TYPE.ACCOUNT.TYPE,
            // Constant.DATABASE.HELP_CENTER_TYPE.BILLING.TYPE,
            Constant.DATABASE.HELP_CENTER_TYPE.HOME_LOANS.TYPE,
            // Constant.DATABASE.HELP_CENTER_TYPE.PROPERTIES.TYPE,
            Constant.DATABASE.HELP_CENTER_TYPE.FAQ.TYPE,

        ],
        index: true,
    },
    actions: [{
        userRole: { type: String },
        userId: { type: String },
        name: { type: String },
        firstName: { type: String },
        actionTime: { type: Number },
    }],
    createdAt: { type: Number, required: true, index: true },
    updatedAt: { type: Number, required: true, index: true },
}, {
        versionKey: false,
    });

export let HelpCentre = model<IHelpCenter>('helpcenter', helpCenterSchema);

helpCenterSchema.index({ title: -1 })