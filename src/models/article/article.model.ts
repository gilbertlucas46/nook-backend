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
    // categoryId: number;
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
    categoryId: {
        // type: Number, enum: [
        //     Constant.DATABASE.ARTICLE_TYPE.AGENTS.NUMBER,
        //     Constant.DATABASE.ARTICLE_TYPE.BUYING.NUMBER,
        //     // Constant.DATABASE.ARTICLE_TYPE.FEATURED_ARTICLE.NUMBER,
        //     Constant.DATABASE.ARTICLE_TYPE.HOME_LOANS.NUMBER,
        //     Constant.DATABASE.ARTICLE_TYPE.RENTING.NUMBER,
        //     Constant.DATABASE.ARTICLE_TYPE.SELLING.NUMBER,
        //     Constant.DATABASE.ARTICLE_TYPE.NEWS.NUMBER,

        // ], index: true,
        type: Schema.Types.ObjectId, required: true,
    },
    addedBy: { type: String },
    categoryType: {
        type: String,
        // enum: [
        // Constant.DATABASE.ARTICLE_TYPE.AGENTS.TYPE,
        // Constant.DATABASE.ARTICLE_TYPE.BUYING.TYPE,
        // // Constant.DATABASE.ARTICLE_TYPE.FEATURED_ARTICLE.TYPE,
        // Constant.DATABASE.ARTICLE_TYPE.HOME_LOANS.TYPE,
        // Constant.DATABASE.ARTICLE_TYPE.RENTING.TYPE,
        // Constant.DATABASE.ARTICLE_TYPE.SELLING.TYPE,
        // Constant.DATABASE.ARTICLE_TYPE.NEWS.TYPE,
        // ], index: true,
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
        userRole: { type: String },
        userId: { type: String },
        actionTime: { type: Number },
    }],
}, {
        versionKey: false,
    });
export const Article = model<IArticle>('Article', articleSchema);