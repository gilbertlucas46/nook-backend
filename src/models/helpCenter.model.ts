import * as mongoose from 'mongoose';
import { Schema, Document } from 'mongoose';
import * as Constant from '../constants';

// export interface IArticleAction {
//     userRole: string;
//     userId: string;
//     actionTime: number;
// }

export interface IHelpCenter extends Document {
    title: string;
    userId: string;
    description: string;
    viewCount?: number;
    shareCount?: number;
    userRole: number;
    createdAt: number;
    updatedAt: number;
    imageUrl: string;
    isFeatured: boolean;
    // articleAction: [IArticleAction];
}

const helpCenter = new Schema({
    _id: { type: Schema.Types.ObjectId, required: true, auto: true },
    title: { type: String },
    videoUrl: { type: String },
    userId: { type: Schema.Types.ObjectId, required: true },
    userRole: {
        type: String,
        enum: [
            Constant.DATABASE.USER_TYPE.ADMIN.TYPE,
            // Constant.DATABASE.USER_TYPE.STAFF.TYPE,
        ],
    },
    description: { type: String },
    likesCount: { type: Number },
    disLikesCount: { type: Number },
    // status: {
    //     type: Number, enum: [
    //         Constant.DATABASE.ARTICLE_STATUS.PENDING.NUMBER,
    //         Constant.DATABASE.ARTICLE_STATUS.ACTIVE.NUMBER,
    //         Constant.DATABASE.ARTICLE_STATUS.BLOCKED.NUMBER,
    //     ],
    //     default: Constant.DATABASE.ARTICLE_STATUS.ACTIVE.NUMBER,
    // },
    // helpCenterAction: [{
    //     userRole: { type: String },
    //     userId: { type: String },
    //     actionTime: { type: Number },
    // }],
    createdAt: { type: Number },
    updatedAt: { type: Number },
});

export const HelpCenter = mongoose.model<IHelpCenter>('HelpCenter', helpCenter);
