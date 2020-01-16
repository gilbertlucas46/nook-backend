import { Schema, Document, model } from 'mongoose';
import * as Constant from '../../constants';

export interface IArticleAction {
    userRole: string;
    userId: string;
    actionTime: number;
}

export interface IArticle extends Document {
    title: string;
    userId: string;
    categoryId: string;
    categoryType: string;
    description: string;
    viewCount?: number;
    shareCount?: number;
    userRole: number;
    status: number;
    createdAt: number;
    updatedAt: number;
    imageUrl: string;
    isFeatured: boolean;
    articleAction: [IArticleAction];
    addedBy: string;
}

const articleSchema = new Schema({
    _id: { type: Schema.Types.ObjectId, required: true, auto: true },
    title: { type: String },
    categoryId: { type: Schema.Types.ObjectId, required: true },
    addedBy: { type: String },
    categoryType: { type: String },
    imageUrl: { type: String },
    userId: { type: Schema.Types.ObjectId, required: true, index: true },
    userRole: {
        type: String,
        enum: [
            Constant.DATABASE.USER_TYPE.ADMIN.TYPE,
            Constant.DATABASE.USER_TYPE.STAFF.TYPE,
        ], index: true,
    },
    description: { type: String },
    shortDescription: { type: String },
    viewCount: { type: Number },
    shareCount: { type: Number },
    status: {
        type: String, enum: [
            Constant.DATABASE.ARTICLE_STATUS.PENDING,
            Constant.DATABASE.ARTICLE_STATUS.ACTIVE,
            Constant.DATABASE.ARTICLE_STATUS.BLOCK,
        ], index: true,
        default: Constant.DATABASE.ARTICLE_STATUS.ACTIVE,
    },
    createdAt: { type: Number, required: true },
    updatedAt: { type: Number, required: true },
    isFeatured: { type: Boolean, default: false },
    articleAction: [{
        addedBy: { type: String },
        userId: { type: String },
        actionTime: { type: Number },
    }],
}, {
    versionKey: false,
});
export const Article = model<IArticle>('Article', articleSchema);