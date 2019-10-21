import { Schema, model, Document } from 'mongoose';
import * as CONSTANT from '../../constants';
export interface IAdmin extends Document {
	_id: string;
	name: string;
	otp?: string;
	securityKey?: string;
	fpotp?: string;
	fpotpGeneratedTime?: Date;
	fpotpExpiryTime?: Date;
	isLogin?: boolean;
	// isDeleted?: boolean,
	email: string;
	password: string;
	firstName?: string;
	lastName?: string;
	phoneNumber?: string;
	countryCode?: string;
	fullPhoneNumber?: string;
	profilePicUrl?: string;
	backGroundImageUrl?: string;
	isEmailVerified?: boolean;
	isPhoneVerified?: boolean;
	passwordResetToken?: string;
	passwordResetTokenExpirationTime?: Date;
}

export const AdminSchema = new Schema(
	{
		_id: { type: Schema.Types.ObjectId, required: true, auto: true },
		name: { type: String, default: '' },
		firstName: { type: String },
		lastName: { type: String },
		email: { type: String, index: true },
		otp: { value: String, generatedTime: Date, expiryTime: Date, default: '' },
		securityKey: { type: String, default: '' },
		phoneNumber: { type: String, index: true },
		fullPhoneNumber: { type: String },
		password: { type: String, default: '' },
		fpotp: { type: String, trim: true },
		fpotpGeneratedTime: { type: Date },
		fpotpExpiryTime: { type: Date },
		isLogin: { type: Boolean, default: true },
		isDeleted: { type: Boolean, default: false },
		profilePicUrl: { type: String, default: '' },
		backGroundImageUrl: { type: String },
		isEmailVerified: { type: Boolean },
		isPhoneVerified: { type: Boolean },
		passwordResetToken: { type: String },
		passwordResetTokenExpirationTime: { type: Date },
		staffLoggedIn: { type: Schema.Types.Boolean, default: false },
		staffStatus: {
			type: String, enum: [
				CONSTANT.DATABASE.STATUS.USER.ACTIVE,
				CONSTANT.DATABASE.STATUS.USER.DELETED,
				CONSTANT.DATABASE.STATUS.USER.BLOCKED,
			],
		},
		permission: {
			type: [Schema.Types.String], enum: [
				CONSTANT.DATABASE.PERMISSION.TYPE.DASHBOARD,
				CONSTANT.DATABASE.PERMISSION.TYPE.ALL_PROPERTIES,
				CONSTANT.DATABASE.PERMISSION.TYPE.ACTIVE_PROPERTIES,
				CONSTANT.DATABASE.PERMISSION.TYPE.PENDING_PROPERTIES,
				CONSTANT.DATABASE.PERMISSION.TYPE.DECLINED_PROPERTIES,
				CONSTANT.DATABASE.PERMISSION.TYPE.HELP_CENTER,
				CONSTANT.DATABASE.PERMISSION.TYPE.ARTICLE,
				CONSTANT.DATABASE.PERMISSION.TYPE.USERS,
				CONSTANT.DATABASE.PERMISSION.TYPE.PROPERTY,
			],
		},
		createdAt: { type: Number, required: true },
		updatedAt: { type: Number, required: true },
		type: {
			type: String,
			enum: [
				CONSTANT.DATABASE.USER_TYPE.STAFF.TYPE,
				CONSTANT.DATABASE.USER_TYPE.ADMIN.TYPE,
			], index: true,
			default: CONSTANT.DATABASE.USER_TYPE.ADMIN.TYPE,
		},
	},
);

export const Admin = model<IAdmin>('Admin', AdminSchema);
