import * as mongoose from 'mongoose';
import { Schema } from 'mongoose';
import * as Constant from '../constants';

const articleSchema = new Schema({
    _id: { type: Schema.Types.ObjectId, required: true, auto: true },
    type: {
        type: String, enum: [
            Constant.DATABASE.USER_TYPE.ADMIN,
            Constant.DATABASE.USER_TYPE.STAFF,
        ],
    },
    articleType: {
        type: String, enum: [
            Constant.DATABASE.ARTICLE_TYPE.AGENTS.NUMBER,
            Constant.DATABASE.ARTICLE_TYPE.BUYING.NUMBER,
            Constant.DATABASE.ARTICLE_TYPE.FEATURED_ARTICLE.NUMBER,
            Constant.DATABASE.ARTICLE_TYPE.HOME_LOANS.NUMBER,
            Constant.DATABASE.ARTICLE_TYPE.RENTING.NUMBER,
            Constant.DATABASE.ARTICLE_TYPE.SELLING.NUMBER,
        ],
    },
    userId: { type: Schema.Types.ObjectId },
    description: { type: String },
    viewCount: { type: Number },
    shareCount: { type: Number },
});

export let Enquiry = mongoose.model('Article', articleSchema);
