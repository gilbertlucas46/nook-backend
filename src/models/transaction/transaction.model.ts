import { Schema, model, Types, Document } from 'mongoose';

import * as CONSTANT from '@src/constants/app.constant';
import { invoiceNumber } from '../../utils/index';

export interface ITransaction extends Document {
	transactionId: string;
	subscriptionId: Types.ObjectId;
	amount: number;
	currency: string;
	chargeId: string;
	cardId: string;
	receiptUrl: string;
	description: string;
	status: string;
	userId: Types.ObjectId;
	invoiceNo: string;
	featuredType: string;
	billingType: string;
	createdAt: number;
	updatedAt: number;
}

export const transactionSchema = new Schema({
	_id: { type: Schema.Types.ObjectId, required: true, auto: true },
	transactionId: { type: String, index: true, required: true }, // balance_transaction
	subscriptionId: { type: Schema.Types.ObjectId, required: true, ref: 'Subscription' },
	amount: { type: Number, required: true },
	currency: { type: String },
	chargeId: { type: String, index: true, required: true },
	cardId: { type: String, required: true },
	receiptUrl: { type: String },
	description: { type: String },
	status: {
		type: String,
		enum: ["succeeded"],
		required: true
	},
	userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
	invoiceNo: { type: String },
	featuredType: {
		type: String,
		enum: [
			CONSTANT.DATABASE.FEATURED_TYPE.PROFILE,
			CONSTANT.DATABASE.FEATURED_TYPE.PROPERTY,
			CONSTANT.DATABASE.FEATURED_TYPE.HOMEPAGE
		]
	},
	billingType: {
		type: String,
		enum: [
			CONSTANT.DATABASE.BILLING_TYPE.MONTHLY,
			CONSTANT.DATABASE.BILLING_TYPE.YEARLY
		]
	},
	paymentMethod: { type: String },
	createdAt: { type: Number, required: true },
	updatedAt: { type: Number, required: true }
});

transactionSchema.pre('save', function (this: any, next: () => void) {
	if (!this.invoiceNo) {
		this.invoiceNo = invoiceNumber(++global.counters.Transaction);
	}
	next();
});

export const Transaction = model<ITransaction>('Transaction', transactionSchema);