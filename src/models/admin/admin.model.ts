import { Schema, model } from 'mongoose';
import * as mongoose from 'mongoose';

export interface IAdmin extends mongoose.Document {
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
		createdAt: { type: Number, default: new Date().getTime() },
		updatedAt: { type: Number, default: new Date().getTime() },
	},
	{ timestamps: true },
);

export const Admin = model<IAdmin>('Admin', AdminSchema);