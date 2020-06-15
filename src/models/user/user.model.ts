import { Schema, Document, model, Types } from 'mongoose';
import * as CONSTANT from '../../constants/app.constant';
export interface IUser extends Document {
	userName: string;
	email: string;
	password: string;
	firstName: string;
	middleName: string;
	lastName: string;
	phoneNumber: string;
	type: string;
	title?: string;
	countryCode: string;
	fullPhoneNumber?: string;
	language?: string;
	aboutMe?: string;
	profilePicUrl?: string;
	// isEmailVerified?: boolean;
	// isPhoneVerified?: boolean;
	// isProfileComplete: boolean;
	passwordResetToken?: string;
	passwordResetTokenExpirationTime?: Date;
	backGroundImageUrl: string;
}

const userSchema = new Schema({
	_id: { type: Schema.Types.ObjectId, required: true, auto: true },
	userName: { type: String, index: true, unique: true },
	email: { type: String, trim: true, index: true, unique: true },
	password: { type: String, trim: true },
	firstName: { type: String, index: true },
	middleName: { type: String },
	lastName: { type: String },
	phoneNumber: { type: String },
	fullPhoneNumber: { type: String },
	language: { type: String },
	aboutMe: { type: String },
	profilePicUrl: { type: String },
	backGroundImageUrl: { type: String },
	type: { type: String, default: 'Tenant' },
	status: {
		type: String, enum: [
			CONSTANT.DATABASE.STATUS.USER.ACTIVE,
			CONSTANT.DATABASE.STATUS.USER.BLOCKED,
			CONSTANT.DATABASE.STATUS.USER.DELETE,
		],
		default: CONSTANT.DATABASE.STATUS.USER.ACTIVE,
		index: true,
	},
	ipAddress: { type: String },
	createdAt: { type: Number, required: true, index: true },
	updatedAt: { type: Number, required: true, index: true },
	passwordResetToken: { type: String },
	passwordResetTokenExpirationTime: { type: Date },

}, {
		versionKey: false,
	},
);

export let User = model<IUser>('User', userSchema);

// userSchema.index({ isHomePageFeatured: -1, isFeaturedProfile: -1, createdAt: 1, updatedAt: 1 });
