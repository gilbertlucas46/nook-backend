import { Schema, model, Document } from 'mongoose';

export interface IWebhook extends Document {
	transactionId: string;
	webhookObject: any;
	createdAt: number;
	updatedAt: number;
}

export const webhookSchema = new Schema({
	_id: { type: Schema.Types.ObjectId, required: true, auto: true },
	transactionId: { type: String, index: true, required: true },
	webhookObject: {},
	createdAt: { type: Number, required: true },
	updatedAt: { type: Number, required: true },
}, {
	versionKey: false,
});

export const Webhook = model<IWebhook>('Webhook', webhookSchema);