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
    _id: { type: Schema.Types.ObjectId, required: true, auto: true },
    userId: { type: Schema.Types.ObjectId },
    stripeCustomerId: { type: Schema.Types.String },
    // cardDetails: [{
    //     cardNumber: { type: Number },
    //     cvvNumber: { type: Number },
    //     expiryDate:{}
    // }]
    cardTokenDetail: { type: Schema.Types.Mixed },
    updatedAt: { type: Number, required: true },
});

export let Payment = model<IPayment>('payment', paymentSchema);