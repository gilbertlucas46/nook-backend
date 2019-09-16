import * as mongoose from 'mongoose';
import { Schema, Document } from 'mongoose';
import * as CONSTANT from '../constants/app.constant';

export interface IUser extends Document {
	userName: string;
	email: string;
	password: string;
	firstName: string;
	lastName: string;
	phoneNumber: string;
	type: string;
	title?: string;
	license?: string;
	taxNumber?: string;
	faxNumber?: string;
	fullPhoneNumber?: string;
	language?: string;
	companyName?: string;
	address?: string;
	aboutMe?: string;
	profilePicUrl?: string;
	isEmailVerified?: boolean;
	isPhoneVerified?: boolean;
	isProfileComplete: boolean;
	passwordResetToken?: string;
	passwordResetTokenExpirationTime?: Date;
	backGroundImageUrl: string;
	isFeaturedProfile: boolean;
	// roleType:{
	//     type:Array ,
	// }
}

const userSchema = new Schema({
	userName: { type: String, index: true, unique: true },
	email: { type: String, trim: true, index: true, unique: true },
	password: { type: String, trim: true },
	firstName: { type: String },
	lastName: { type: String },
	phoneNumber: { type: String },
	title: { type: String },
	license: { type: String },
	taxnumber: { type: String },
	faxNumber: { type: String },
	fullPhoneNumber: { type: String },
	language: { type: String },
	companyName: { type: String },
	address: {
		type: String,
	},
	aboutMe: { type: String },
	profilePicUrl: { type: String },
	backGroundImageUrl: { type: String },
	isEmailVerified: { type: Boolean },
	isPhoneVerified: { type: Boolean },
	countryCode: { type: String },
	// roleType: { type: String, enum: [] },
	status: {
		type: String, enum: [
			CONSTANT.DATABASE.STATUS.USER.ACTIVE,
			CONSTANT.DATABASE.STATUS.USER.BLOCKED,
			CONSTANT.DATABASE.STATUS.USER.DELETED,
		],
		default: CONSTANT.DATABASE.STATUS.USER.ACTIVE,
	},
	createdAt: { type: Number, default: new Date().getTime() },
	updatedAt: { type: Number, default: new Date().getTime() },

	type: {
		type: String,
		enum: [
			CONSTANT.DATABASE.USER_TYPE.AGENT.TYPE,
			CONSTANT.DATABASE.USER_TYPE.OWNER.TYPE,
			CONSTANT.DATABASE.USER_TYPE.TENANT.TYPE,
			CONSTANT.DATABASE.USER_TYPE.GUEST.TYPE,
		],
		default: CONSTANT.DATABASE.USER_TYPE.TENANT.TYPE,
	},
	isProfileComplete: { type: Boolean, default: false },
	passwordResetToken: { type: String },
	passwordResetTokenExpirationTime: { type: Date },
	isFeaturedProfile: { type: Boolean, default: false },

});

export let User = mongoose.model<IUser>('User', userSchema);
