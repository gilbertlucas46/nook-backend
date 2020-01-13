import { Schema, model, Document } from 'mongoose';
import * as CONSTANT from '../../constants';
// import * as SCHEMA_VALIDATOR from '../revalidator';
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
	permisssion: [object];
	staffStatus: string;
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
				CONSTANT.DATABASE.STATUS.ADMIN.ACTIVE,
				// CONSTANT.DATABASE.STATUS.ADMIN.PENDING,
				CONSTANT.DATABASE.STATUS.ADMIN.DELETE,
				CONSTANT.DATABASE.STATUS.ADMIN.BLOCKED,
			],
			default: CONSTANT.DATABASE.STATUS.ADMIN.ACTIVE,
		},
		permission: [{
			moduleName: {
				type: String, enum: [
					CONSTANT.DATABASE.PERMISSION.TYPE.DASHBOARD,
					CONSTANT.DATABASE.PERMISSION.TYPE.HELP_CENTER,
					CONSTANT.DATABASE.PERMISSION.TYPE.ARTICLE,
					CONSTANT.DATABASE.PERMISSION.TYPE.USERS,
					CONSTANT.DATABASE.PERMISSION.TYPE.PROPERTIES,
					CONSTANT.DATABASE.PERMISSION.TYPE.LOAN,
					CONSTANT.DATABASE.PERMISSION.TYPE.STAFF,
					CONSTANT.DATABASE.PERMISSION.TYPE.Article_Category,
					CONSTANT.DATABASE.PERMISSION.TYPE.Subscriptions,
					CONSTANT.DATABASE.PERMISSION.TYPE.loanReferrals,

				],
			},
			accessLevel: { type: Number, enum: [CONSTANT.PRIVILEGE.SUB_ADMIN_PRIVILEGE] },

		}],
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
	}, {
		versionKey: false,
	},
);

export const Admin = model<IAdmin>('Admin', AdminSchema);
