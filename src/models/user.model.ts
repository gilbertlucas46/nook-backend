import * as mongoose from 'mongoose';
import { Schema, Document, model } from "mongoose";
import * as CONSTANT from '../constants/app.constant'

export interface IUser extends Document {
    userName: String;
    email: string;
    password: string
    firstName: string;
    lastName: string;
    phoneNumber: string
    // type: Array<string>
    title?: string
    license?: string;
    taxnumber?: string;
    faxNumber?: string;
    fullMobileNumber?: string;
    language?: string;
    companyName?: string;
    address?: string;
    aboutMe?: string
    profilePicUrl?: string;
    isEmailVerified?: boolean;
    isPhoneVerified?: boolean;
    // roleType:{
    //     type:Array ,
    // }
}

const userSchema = new Schema({
    userName: { type: String, index: true },
    email: { type: String, trim: true, index: true, unique: true },
    password: { type: String, trim: true },
    firstName: { type: String, index: true },
    lastName: { type: String, },
    phone: { type: String, },
    title: { type: String },
    license: { type: String },
    taxnumber: { type: String },
    faxNumber: { type: String },
    fullMobileNumber: { type: String },
    language: { type: String },
    companyName: { type: String },
    address: {
        type: String
    },
    aboutMe: { type: String },
    profilePicUrl: { type: String },
    isEmailVerified: { type: Boolean },
    isPhoneVerified: { type: Boolean },
    createdAt: { type: Date },
    updatedAt: { type: Date },
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
});
export let User = mongoose.model<IUser>("User", userSchema);