import { Schema, model, Document } from 'mongoose';
export interface ISession extends Document {
	userId?: string;
	validAttempt: boolean;
	ipAddress: string;
	deviceId:string;
	deviceToken: string;
	deviceType: string;
	source: string;
	createdAt?: number;
	updatedAt?: number;
}

const sessionSchema = new Schema({
	_id: { type: Schema.Types.ObjectId, required: true },
	userId: { type: Schema.Types.ObjectId, ref: 'User' },
	// validAttempt: { type: Boolean, required: true, default: false },
	// ipAddress: { type: String },
	deviceId: { type: String },
	source: { type: String },
	loginStatus: { type: Boolean, required: true, default: true },
	lastActivityTime: { type: Number },
	createdAt: { type: Number, required: true },
	updatedAt: { type: Number, required: true },
	type: { type: String },
});

sessionSchema.index({ userId: 1, loginStatus: 1 });
export let Session = model<ISession>('Session', sessionSchema);
