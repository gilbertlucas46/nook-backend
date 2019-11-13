
import { Schema, model, Model, Types, Document } from 'mongoose';
// import { TransactionDocument } from './transaction.document';

export interface ITransaction {
    userId: Types.ObjectId;
    transactionId: string;
    status: string;
    message: string;
}
// export interface TransactionDocument extends Document, ITransaction { }

export const transactionSchema = new Schema({
    userId: { type: Schema.Types.ObjectId },
    transactionId: { type: String },
    status: { type: String },
    message: { type: String },
    received: { type: Schema.Types.Mixed },
    createdAt: { type: Number, required: true, default: new Date().getTime() },
    updatedAt: { type: Number, required: true, default: new Date().getTime() },
});

// export let LoanReferral: Model<CityDocument> = model ('')
// export const Transaction: Model<ITransaction> = model('transaction', transactionSchema);

// export let Payment = model<IPayment>('payment', paymentSchema);