import * as mongoose from 'mongoose';
import { Schema, Document } from 'mongoose';
import * as Constant from '../constants';
import { join } from 'path';
export interface IEnquiry extends Document {
    category: string;
    title: string;
    userId: string;
    categoryId: number;
    categoryName: string;
    description: string;
    viewCount?: number;
    shareCount?: number;
    userRole: number;
    status: number;
    createdAt: number;
    updatedAt: number;
    imageUrl: string;
    isFeatured: boolean;
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
        ],
    },
    categoryType: {
        type: String, enum: [
            Constant.DATABASE.ARTICLE_TYPE.AGENTS.TYPE,
            Constant.DATABASE.ARTICLE_TYPE.BUYING.TYPE,
            Constant.DATABASE.ARTICLE_TYPE.FEATURED_ARTICLE.TYPE,
            Constant.DATABASE.ARTICLE_TYPE.HOME_LOANS.TYPE,
            Constant.DATABASE.ARTICLE_TYPE.RENTING.TYPE,
            Constant.DATABASE.ARTICLE_TYPE.SELLING.TYPE,
        ],
    },
    imageUrl: { type: String },
    userId: { type: Schema.Types.ObjectId, required: true },
    userRole: {
        type: String,
        enum: [
            Constant.DATABASE.USER_TYPE.ADMIN.TYPE,
            Constant.DATABASE.USER_TYPE.STAFF.TYPE,
        ],
    },
    description: { type: String },
    viewCount: { type: Number },
    shareCount: { type: Number },
    status: {
        type: Number, enum: [
            Constant.DATABASE.ARTICLE_STATUS.PENDING.NUMBER,
            Constant.DATABASE.ARTICLE_STATUS.ACTIVE.NUMBER,
            Constant.DATABASE.ARTICLE_STATUS.BLOCKED.NUMBER,
        ],
        default: Constant.DATABASE.ARTICLE_STATUS.ACTIVE.NUMBER,
    },
    createdAt: { type: Number },
    updatedAt: { type: Number },
    isFeatured: { type: Boolean },
});

export const Article = mongoose.model<IEnquiry>('Article', articleSchema);
