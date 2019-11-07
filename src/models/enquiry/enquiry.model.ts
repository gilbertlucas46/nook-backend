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
    // _id: { type: Schema.Types.ObjectId, required: true, auto: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', allow: '' },
    propertyId: { type: Schema.Types.ObjectId, ref: 'Property', index: true },
    email: { type: String, index: true },
    propertyOwnerId: { type: Schema.Types.ObjectId, index: true },
    name: { type: String, required: true },
    userType: {
        type: String,
        // enum: [
        //     CONSTANT.DATABASE.ENQUIRY_TYPE.GUEST.NUMBER,
        //     CONSTANT.DATABASE.ENQUIRY_TYPE.REGISTERED_USER.NUMBER,
        // ], index: true,
    },
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
            CONSTANT.DATABASE.ENQUIRY_TYPE.ENQUIRY,
        ], index: true,
    },
    createdAt: { type: Number, required: true },
    updatedAt: { type: Number, required: true },
});

enquirySchema.index({ userId: 1, propertyId: 1 }, { unique: true });

export let Enquiry = model<IEnquiry>('Enquiry', enquirySchema);