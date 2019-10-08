import { Schema, model, Document } from 'mongoose';

export interface IAdminSession extends Document {
	_id: string;
	adminId: string;
	// isDeleted:  Boolean,
	lastActiveTime: Date;
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
		deviceId: { types: String },
		isDeleted: { type: Boolean, default: false },
		lastActiveTime: { type: Date },
		isLogin: { type: Boolean, default: false },
		createdAt: { type: Number, required: true },
		updatedAt: { type: Number, required: true },
	},
);

export const AdminSession = model('AdminSession', AdminSessionSchema);
