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
	status: { type: String, required: true },
	billingType: { type: String },
	productId: { type: String },
	receiptUrl: { type: String },
	// enum: [
	// 	CONSTANT.DATABASE.TRANSACTION_STATUS.SUCCEEDED,
	// 	CONSTANT.DATABASE.TRANSACTION_STATUS.PENDING,
	// 	CONSTANT.DATABASE.TRANSACTION_STATUS.FAILED,
	// ],
	// default: '',
	// },
	userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
	featuredType: { type: String, required: true },
	address: { type: String, required: true },
	invoiceNo: { type: String },
	// featuredType: {
	// 	type: String,
	// 	enum: [
	// 		CONSTANT.DATABASE.FEATURED_TYPE.PROFILE,
	// 		CONSTANT.DATABASE.FEATURED_TYPE.PROPERTY,
	// 		CONSTANT.DATABASE.FEATURED_TYPE.HOMEPAGE,
	// 	],
	// 	required: true,
	// },
	// billingType: {
	// 	type: String,
	// 	enum: [
	// 		CONSTANT.DATABASE.BILLING_TYPE.MONTHLY,
	// 		CONSTANT.DATABASE.BILLING_TYPE.YEARLY,
	// 	],
	// 	required: true,
	// },
	cardHolder: { type: String },
	paymentMethod: { type: String },
	createdAt: { type: Number, required: true },
	updatedAt: { type: Number, required: true },
}, {
		versionKey: false,
	});

transactionSchema.pre('save', function (this: any, next: () => void) {
	if (!this.invoiceNo) {
		this.invoiceNo = invoiceNumber(++global.counters.Transaction);
	}
	next();
});

export const Transaction = model<ITransaction>('Transaction', transactionSchema);