import { Schema, model, Types, Document } from 'mongoose';
import * as CONSTANT from '@src/constants/app.constant';
import { invoiceNumber } from '../../utils/index';

export interface ICard extends Document {
    // transactionId: string;
    // idempotencyKey: string;
    name: string;
    address: string;
    userId: string;
    cardDetail: string;
    // paymentObject: any;
    createdAt: number;
    updatedAt: number;
}

export const cardSchema = new Schema({
    name: { type: String },
    address: { type: String },
    userId: { type: Schema.Types.ObjectId, required: true },
    cardDetail: { type: Schema.Types.Mixed, required: true },
    createdAt: { type: Number, required: true },
    updatedAt: { type: Number, required: true },
}, {
        versionKey: false,
    });


export const Card = model<ICard>('Card', cardSchema);