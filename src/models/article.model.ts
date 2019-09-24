import * as mongoose from 'mongoose';
import { Schema, Document } from 'mongoose';
import * as Constant from '../constants';
import { number, strict } from 'joi';
import { ObjectID } from 'bson';
export interface IEnquiry extends Document {
    category: string;
    userId: string;
    description: string;
    viewCount?: string;
    shareCount?: string;
}

const articleSchema = new Schema({
    _id: { type: Schema.Types.ObjectId, required: true, auto: true },
    uploadBy: {
        upload_by_number: {
            type: {
                type: Number, enum: [
                    Constant.DATABASE.USER_TYPE.ADMIN.NUMBER,
                    Constant.DATABASE.USER_TYPE.STAFF.NUMBER,
                ],
            },
        },
        upload_by_string: {
            type: String, enum: [
                Constant.DATABASE.USER_TYPE.ADMIN.NUMBER,
                Constant.DATABASE.USER_TYPE.STAFF.NUMBER,
            ],
        },
        upload_by_displayName: {
            type: String, enum: [
                Constant.DATABASE.USER_TYPE.ADMIN.DISPLAY_NAME,
                Constant.DATABASE.USER_TYPE.STAFF.DISPLAY_NAME,
            ],
        },
        name: { type: String },
        userId: { type: Schema.Types.ObjectId },
    },
    userId: { type: Schema.Types.ObjectId },
    description: { type: String },
    viewCount: { type: Number },
    shareCount: { type: Number },
    articleAction: [{
        updateBy: { type: String },
        userId: { type: String },
        updatedAt: { type: Number },
        type: { type: String },
    }],
    createdAt: { type: Number },
    updatedAt: { type: Number },
});

export const Article = mongoose.model<IEnquiry>('Article', articleSchema);
