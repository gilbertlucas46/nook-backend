import { Schema, Document, model } from 'mongoose';
import * as Constant from '../../constants';

export interface IArticleAction {
    userRole: string;
    userId: string;
    actionTime: number;
}

export interface IEnquiry extends Document {
    title: string;
    userId: string;
    categoryId: number;
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
}

const articleSchema = new Schema({
    _id: { type: Schema.Types.ObjectId, required: true, auto: true },
    title: { type: String },
    categoryId: {
        type: Number, enum: [
            Constant.DATABASE.ARTICLE_TYPE.AGENTS.NUMBER,
            Constant.DATABASE.ARTICLE_TYPE.BUYING.NUMBER,
            Constant.DATABASE.ARTICLE_TYPE.FEATURED_ARTICLE.NUMBER,
            Constant.DATABASE.ARTICLE_TYPE.HOME_LOANS.NUMBER,
            Constant.DATABASE.ARTICLE_TYPE.RENTING.NUMBER,
            Constant.DATABASE.ARTICLE_TYPE.SELLING.NUMBER,
        ], index: true,
    },
    categoryType: {
        type: String, enum: [
            Constant.DATABASE.ARTICLE_TYPE.AGENTS.TYPE,
            Constant.DATABASE.ARTICLE_TYPE.BUYING.TYPE,
            Constant.DATABASE.ARTICLE_TYPE.FEATURED_ARTICLE.TYPE,
            Constant.DATABASE.ARTICLE_TYPE.HOME_LOANS.TYPE,
            Constant.DATABASE.ARTICLE_TYPE.RENTING.TYPE,
            Constant.DATABASE.ARTICLE_TYPE.SELLING.TYPE,
        ], index: true,
    },
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
    viewCount: { type: Number },
    shareCount: { type: Number },
    status: {
        type: Number, enum: [
            Constant.DATABASE.ARTICLE_STATUS.PENDING.NUMBER,
            Constant.DATABASE.ARTICLE_STATUS.ACTIVE.NUMBER,
            Constant.DATABASE.ARTICLE_STATUS.BLOCKED.NUMBER,
        ], index: true,
        default: Constant.DATABASE.ARTICLE_STATUS.ACTIVE.NUMBER,
    },
    createdAt: { type: Number, required: true },
    updatedAt: { type: Number, required: true },
    isFeatured: { type: Boolean },
    articleAction: [{
        userRole: { type: String },
        userId: { type: String },
        actionTime: { type: Number },
    }],
});

export const Article = model<IEnquiry>('Article', articleSchema);
