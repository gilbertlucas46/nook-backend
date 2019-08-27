import { Schema, Document, model } from 'mongoose'
import * as Constant from '../constants';


export interface ISession extends Document {
    userId: string
    validAttempt: boolean,
    ipAddress: string,
    deviceId: string,
    deviceToken: string,
    deviceType: string,
    source: string,
    deviceModel: string,
    appVersion: string,
    createdAt: Number,
    updatedAt: Number
};

const sessionSchema = new Schema({
    _id: { type: Schema.Types.ObjectId, required: true, auto: true, },
    userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    validAttempt: { type: Boolean, required: true, default: false },
    ipAddress: { type: String, required: true },
    deviceId: { type: String, required: true },
    deviceToken: { type: String },
    deviceType: {
        type: String, required: true, enum: [
            Constant.DATABASE.DEVICE_TYPES.IOS,
            Constant.DATABASE.DEVICE_TYPES.ANDROID
        ]
    },
    source: { type: String },
    deviceModel: { type: String },
    appVersion: { type: String, required: true },
    loginStatus: { type: Boolean, required: true, default: true },
    createdAt: { type: Number, required: true },
    updatedAt: { type: Number, required: true },
});

sessionSchema.index({ userId: 1, loginStatus: 1 })


export let Session = model<ISession>('Session', sessionSchema)
