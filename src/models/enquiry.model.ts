import * as CONSTANT from '../constants/app.constant';
import { Schema, Document, model } from 'mongoose';

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
    propertyId: { type: Schema.Types.ObjectId, required: true, ref: 'Property', index: true },
    email: { type: String, index: true },
    propertyOwnerId: { type: Schema.Types.ObjectId, required: true, index: true },
    name: { type: String, required: true },
    userType: {
        type: Number,
        enum: [
            CONSTANT.DATABASE.ENQUIRY_TYPE.GUEST.NUMBER,
            CONSTANT.DATABASE.ENQUIRY_TYPE.REGISTERED_USER.NUMBER,
        ], index: true,
    },
    phoneNumber: { type: String, index: true },
    message: { type: String },
    enquiry_status: {
        type: String,
        enum: [
            CONSTANT.DATABASE.ENQUIRY_STATUS.PENDING,
            CONSTANT.DATABASE.ENQUIRY_STATUS.RESOLVED,
        ], index: true,
        default: CONSTANT.DATABASE.ENQUIRY_STATUS.PENDING,
    },
    createdAt: { type: Number, required: true },
    updatedAt: { type: Number, required: true },
});

export let Enquiry = model<IEnquiry>('Enquiry', enquirySchena);