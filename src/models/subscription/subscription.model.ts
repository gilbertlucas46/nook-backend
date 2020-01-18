import { Schema, Document, Types, model } from 'mongoose';
import * as CONSTANT from '@src/constants/app.constant';

export interface ISubscription extends Document {
	featuredType: string;
	subscriptionType: string;
	propertyId?: Types.ObjectId;
	userId: Types.ObjectId;
	startDate: number;
	endDate: number;
	createdAt: number;
	updatedAt: number;
	name?: string;
	address: string;
}

const subscriptionSchema = new Schema({
	_id: { type: Schema.Types.ObjectId, required: true, auto: true },
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
	// featuredType: { type: String, required: true },
	subscriptionType: {
		type: String, enum: [
			CONSTANT.DATABASE.BILLING_TYPE.MONTHLY,
			CONSTANT.DATABASE.BILLING_TYPE.YEARLY,
			'day',
		], required: true,
	},
	amount: { type: Number },
	status: { type: String },
	propertyId: { type: Schema.Types.ObjectId, ref: 'Property' },
	userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
	startDate: { type: Number },
	subscriptionId: { type: String, required: true },
	endDate: { type: Number },
	createdAt: { type: Number, required: true },
	isRecurring: { type: Boolean, default: true },
	updatedAt: { type: Number, required: true },
	// paymentMethod: { type: String, required: true },
	planId: { type: String, required: true },
	eventId: { type: String },
	name: { type: String },
	address: { type: String },
	cardId: { type: String },
	cardExpYear: { type: String },
	cardLast4: { type: String },
	cardBrand: { type: String },
	latestInvoice: { type: String },

}, {
		versionKey: false,
	});

export const Subscription = model<ISubscription>('Subscription', subscriptionSchema);