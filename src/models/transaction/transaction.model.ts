import { Schema, model, Types, Document } from 'mongoose';

export interface ITransaction extends Document {
    transactionId: string;
    amount: number;
    chargeId: string;
    cardId: string;
    receiptUrl: string;
    userId: Types.ObjectId;
    createdAt: number;
    updatedAt: number;
}

export const transactionSchema = new Schema({
    transactionId: { type: String, index: true, required: true },
    amount: { type: Number, required: true },
    chargeId: { type: String, index: true, required: true },
    cardId: { type: String },
    receiptUrl: { type: String },
    userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    createdAt: { type: Number, required: true },
    updatedAt: { type: Number, required: true }
});

export const Transaction = model<ITransaction>('Transaction', transactionSchema);