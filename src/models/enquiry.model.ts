import * as mongoose from 'mongoose';
import * as CONSTANT from '../constants/app.constant';
import { Schema, Document, model } from 'mongoose';
import { join } from 'path';

export interface IEnquiry extends Document {
    name: string;
    phoneNumber: string;
    userType: string;
    email: string;
    propertyId: string;
    propertyOwnerId?: string;
    userId?: string;
    message: string;
}

const enquirySchena = new Schema({
    _id: { type: Schema.Types.ObjectId, required: true, auto: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    propertyId: { type: Schema.Types.ObjectId, required: true, ref: 'Property' },
    email: { type: String },
    propertyOwnerId: { type: String },
    name: { type: String, required: true },
    userType: {
        type: Number,
        enum: [
            CONSTANT.DATABASE.ENQUIRY_TYPE.GUEST.NUMBER,
            CONSTANT.DATABASE.ENQUIRY_TYPE.REGISTERED_USER.NUMBER,
        ],
    },
    phoneNumber: { type: String },
    message: { type: String },
    enquiry_status: {
        type: String,
        enum: [
            CONSTANT.DATABASE.ENQUIRY_STATUS.PENDING,
            CONSTANT.DATABASE.ENQUIRY_STATUS.RESOLVED,
        ],
        default: CONSTANT.DATABASE.ENQUIRY_STATUS.PENDING,
    },
    createdAt: { type: Number, default: new Date().getTime() },
    updatedAt: { type: Number, default: new Date().getTime() },
});

export let Enquiry = mongoose.model<IEnquiry>('Enquiry', enquirySchena);