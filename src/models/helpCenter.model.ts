// import * as mongoose from 'mongoose';
import { Schema, Document, model } from 'mongoose';
import * as Constant from '../constants';
import { string, number } from 'joi';

// export interface IArticleAction {
//     userRole: string;
//     userId: string;
//     actionTime: number;
// }

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
    // articleAction: [IArticleAction];
}

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
    likesCount: { type: Number },
    disLikesCount: { type: Number },
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
    // status: {
    //     type: Number, enum: [
    //         Constant.DATABASE.ARTICLE_STATUS.PENDING.NUMBER,
    //         Constant.DATABASE.ARTICLE_STATUS.ACTIVE.NUMBER,
    //         Constant.DATABASE.ARTICLE_STATUS.BLOCKED.NUMBER,
    //     ],
    //     default: Constant.DATABASE.ARTICLE_STATUS.ACTIVE.NUMBER,
    // },
    actions: [{
        userRole: { type: String },
        userId: { type: String },
        actionTime: { type: Number },
    }],
    createdAt: { type: Number },
    updatedAt: { type: Number },
});

export let HelpCentre = model<IHelpCenter>('helpcenter', helpCenterSchema);
