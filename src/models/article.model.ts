import * as mongoose from 'mongoose';
import { Schema, Document } from 'mongoose';
import * as Constant from '../constants';
import { number } from 'joi';
export interface IEnquiry extends Document {
    uploadBy: string;
    category: string;
    userId: string;
    description: string;
    viewCount?: string;
    shareCount?: string;
}

const articleSchema = new Schema({
    _id: { type: Schema.Types.ObjectId, required: true, auto: true },
    uploadBy: {
        type: String, enum: [
            Constant.DATABASE.USER_TYPE.ADMIN.TYPE,
            Constant.DATABASE.USER_TYPE.STAFF.TYPE,
        ],
        name: { type: String },
        userId: { type: Schema.Types.ObjectId },
    },
    category: {
        type: String, enum: [
            Constant.DATABASE.ARTICLE_TYPE.AGENTS.NUMBER,
            Constant.DATABASE.ARTICLE_TYPE.BUYING.NUMBER,
            Constant.DATABASE.ARTICLE_TYPE.FEATURED_ARTICLE.NUMBER,
            Constant.DATABASE.ARTICLE_TYPE.HOME_LOANS.NUMBER,
            Constant.DATABASE.ARTICLE_TYPE.RENTING.NUMBER,
            Constant.DATABASE.ARTICLE_TYPE.SELLING.NUMBER,
        ],
    },
    userId: { type: Schema.Types.ObjectId, required: true },
    description: { type: String },
    viewCount: { type: Number },
    shareCount: { type: Number },
    articleAction: [{
        userId: { type: String },
        updatedAt: { type: Number },
    }],
    createdAt: { type: Number },
    updatedAt: { type: Number },
});

export const Article = mongoose.model<IEnquiry>('Article', articleSchema);
