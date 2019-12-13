import { Schema, Document, model } from 'mongoose';
import * as Constant from '../../constants';

export interface IPayment extends Document {
    userId: string;
    cardDetail: string[];
    stripeCustomerId: string;
    updatedAt: number;
    createdAt: number;
}

const paymentSchema = new Schema({
    userId: { type: Schema.Types.ObjectId },
    stripeCustomerId: { type: Schema.Types.String },
    cardDetail: [{ type: Schema.Types.Mixed }],
    createdAt: { type: Number },
    updatedAt: { type: Number, required: true },
}, {
    versionKey: false,
},
);

export let Payment = model<IPayment>('payment', paymentSchema);
