import * as mongoose from 'mongoose';
import { Schema, Document } from 'mongoose';
import * as Constant from '../constants';
export interface IEnquiry extends Document {
    category: string;
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
}

const articleSchema = new Schema({
    _id: { type: Schema.Types.ObjectId, required: true, auto: true },
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
    categoryName: {
        type: String, enum: [
            Constant.DATABASE.ARTICLE_TYPE.AGENTS.DISPLAY_NAME,
            Constant.DATABASE.ARTICLE_TYPE.BUYING.DISPLAY_NAME,
            Constant.DATABASE.ARTICLE_TYPE.FEATURED_ARTICLE.DISPLAY_NAME,
            Constant.DATABASE.ARTICLE_TYPE.HOME_LOANS.DISPLAY_NAME,
            Constant.DATABASE.ARTICLE_TYPE.RENTING.DISPLAY_NAME,
            Constant.DATABASE.ARTICLE_TYPE.SELLING.DISPLAY_NAME,
        ],
    },
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
});

export const Article = mongoose.model<IEnquiry>('Article', articleSchema);
