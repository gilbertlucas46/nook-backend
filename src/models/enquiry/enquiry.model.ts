import * as CONSTANT from '../../constants/app.constant';
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
    enquiryType?: string;
    agentId?: string;
    enquiry_status?: string;
    createdAt: number;
    updatedAt: number;
}

const enquirySchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', allow: '' },
    propertyId: { type: Schema.Types.ObjectId, ref: 'Property', index: true },
    email: { type: String, index: true },
    propertyOwnerId: { type: Schema.Types.ObjectId, index: true },
    name: { type: String, required: true },
    userType: { type: String },
    phoneNumber: { type: String, index: true },
    message: { type: String },
    agentId: { type: Schema.Types.ObjectId },
    enquiry_status: {
        type: String,
        enum: [
            CONSTANT.DATABASE.ENQUIRY_STATUS.PENDING,
            CONSTANT.DATABASE.ENQUIRY_STATUS.RESOLVED,
        ], index: true,
        default: CONSTANT.DATABASE.ENQUIRY_STATUS.PENDING,
    },
    enquiryType: {
        type: String,
        enum: [
            CONSTANT.DATABASE.ENQUIRY_TYPE.CONTACT,
            CONSTANT.DATABASE.ENQUIRY_TYPE.PROPERTY,
        ], index: true,
    },

    createdAt: { type: Number, required: true },
    updatedAt: { type: Number, required: true },
}, {
    versionKey: false,
});

export let Enquiry = model<IEnquiry>('Enquiry', enquirySchema);