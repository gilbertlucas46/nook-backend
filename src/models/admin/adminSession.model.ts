import { Schema, model } from 'mongoose';
import * as mongoose from 'mongoose';

export interface IAdminSession extends mongoose.Document {
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
		// loginStatus: { type: Boolean, default: false },
	},
	{ timestamps: true },
);

export const AdminSession = model('AdminSession', AdminSessionSchema);
