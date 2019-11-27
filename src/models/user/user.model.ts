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
	specializingIn_property_type?: number[];
	specializingIn_property_category?: string[];
	serviceAreas?: Types.ObjectId[];
}

const userSchema = new Schema({
	_id: { type: Schema.Types.ObjectId, required: true, auto: true },
	userName: { type: String, index: true, unique: true },
	email: { type: String, trim: true, index: true, unique: true },
	password: { type: String, trim: true },
	firstName: { type: String },
	middleName: { type: String },
	lastName: { type: String },
	phoneNumber: { type: String },
	title: { type: String },
	license: { type: String },
	taxnumber: { type: String },
	faxNumber: { type: String },
	fullPhoneNumber: { type: String },
	language: { type: String },
	companyName: { type: String },
	address: { type: String },
	aboutMe: { type: String },
	profilePicUrl: { type: String },
	backGroundImageUrl: { type: String },
	isEmailVerified: { type: Boolean },
	isPhoneVerified: { type: Boolean },
	countryCode: { type: String },
	status: {
		type: String, enum: [
			CONSTANT.DATABASE.STATUS.USER.ACTIVE,
			CONSTANT.DATABASE.STATUS.USER.BLOCKED,
			CONSTANT.DATABASE.STATUS.USER.DELETED,
		],
		default: CONSTANT.DATABASE.STATUS.USER.ACTIVE,
	},
	createdAt: { type: Number, required: true },
	updatedAt: { type: Number, required: true },
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
	specializingIn_property_type: [{
		type: Number,
		enum: [
			CONSTANT.DATABASE.PROPERTY_FOR.RENT.NUMBER,
			CONSTANT.DATABASE.PROPERTY_FOR.SALE.NUMBER,
		],
	}],
	specializingIn_property_category: [{
		type: String,
		enum: [
			CONSTANT.DATABASE.PROPERTY_TYPE['APPARTMENT/CONDO'],
			CONSTANT.DATABASE.PROPERTY_TYPE.COMMERCIAL,
			CONSTANT.DATABASE.PROPERTY_TYPE.HOUSE_LOT,
			CONSTANT.DATABASE.PROPERTY_TYPE.LAND,
			CONSTANT.DATABASE.PROPERTY_TYPE.ROOM,
		],
	}],
	serviceAreas: [{
		type: Schema.Types.ObjectId, ref: 'City',  // Refer to city schema
	}],
}, {
		versionKey: false,
	},
);

export let User = model<IUser>('User', userSchema);
