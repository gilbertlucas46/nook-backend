import { Schema, model, Document } from 'mongoose';

export interface IAdminSession extends Document {
	_id: string;
	adminId: string;
	// isDeleted:  Boolean,
	deviceId: string;
	lastActiveTime: number;
	createdAt: number;
	updatedAt: number;
}

export const AdminSessionSchema = new Schema(
	{
		_id: { type: Schema.Types.ObjectId, required: true, auto: true },
		adminId: {
			type: Schema.Types.ObjectId,
			required: true,
			index: true,
			ref: 'Admin',
		},
		deviceId: { type: String },
		isDeleted: { type: Boolean, default: false },
		lastActiveTime: { type: Date },
		isLogin: { type: Boolean, default: false },
		createdAt: { type: Number, required: true },
		updatedAt: { type: Number, required: true },
	},
);

export const AdminSession = model('AdminSession', AdminSessionSchema);
