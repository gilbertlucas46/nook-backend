import { Schema, model, Types, Document } from 'mongoose';
import * as CONSTANT from '@src/constants/app.constant';
import { invoiceNumber } from '../../utils/index';

export interface ITransaction extends Document {
	transactionId: string;
	idempotencyKey: string;
	subscriptionId: Types.ObjectId;
	amount: number;
	currency: string;
	chargeId: string;
	cardId: string;
	receiptUrl: string;
	description: string;
	status: string;
	userId: Types.ObjectId;
	name: string;
	address: string;
	invoiceNo: string;
	featuredType: string;
	billingType: string;
	paymentObject: any;
	createdAt: number;
	updatedAt: number;
	cardHolder: string;
}

export const transactionSchema = new Schema({
	// _id: { type: Schema.Types.ObjectId, required: true, auto: true },
	transactionId: { type: String, index: true, required: true }, // balance_transaction
	subscriptionId: { type: Schema.Types.ObjectId, ref: 'Subscription' },
	amount: { type: Number, required: true },
	currency: { type: String, required: true },
	// chargeId: { type: String, index: true, required: true },
	// cardId: { type: String, required: true },
	// receiptUrl: { type: String, required: true },
	description: { type: String },
	status: { type: String, required: true, default: 'pending' },
	billingType: {
		type: String,
		enum: [
			CONSTANT.DATABASE.BILLING_TYPE.MONTHLY,
			CONSTANT.DATABASE.BILLING_TYPE.YEARLY,
			'day',
		],
		required: true,
	},
	productId: { type: String, required: true },
	receiptUrl: { type: String, required: true },
	userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
	featuredType: {
		type: String,
		enum: [
			CONSTANT.DATABASE.FEATURED_TYPE.PROFILE,
			CONSTANT.DATABASE.FEATURED_TYPE.PROPERTY,
			CONSTANT.DATABASE.FEATURED_TYPE.HOMEPAGE_PROFILE,
			CONSTANT.DATABASE.FEATURED_TYPE.HOMEPAGE_PROPERTY,
		],
		required: true,
	},
	invoiceNo: { type: String },
	cardHolder: { type: String },
	paymentMethod: { type: String },
	createdAt: { type: Number, required: true },
	updatedAt: { type: Number, required: true },
	billingReason: { type: String },
	customer: { type: String },
	customer_email: { type: String },
	paid: { type: Boolean },
}
	, {
		versionKey: false,
	});

transactionSchema.pre('save', function (this: any, next: () => void) {
	if (!this.invoiceNo) {
		this.invoiceNo = invoiceNumber(++global.counters.Transaction);
	}
	next();
});

export const Transaction = model<ITransaction>('Transaction', transactionSchema);