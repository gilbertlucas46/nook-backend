import { Schema, Document, model } from 'mongoose'
import * as Constant from '../constants';


export interface ISession extends Document {
    userId?: string,
    validAttempt: boolean,
    ipAddress: string,
    deviceToken: string,
    deviceType: string,
    source: string,
    deviceModel: string,
    appVersion?: string,
    createdAt: Number,
    updatedAt: Number
};


const sessionSchema = new Schema({
    _id: { type: Schema.Types.ObjectId, required: true, },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    validAttempt: { type: Boolean, required: true, default: false },
    ipAddress: { type: String },
    deviceToken: { type: String },
     
    source: { type: String },
    // deviceModel: { type: String },
    // appVersion: { type: String, required: true },
    loginStatus: { type: Boolean, required: true, default: true },
    lastActivityTime: { type: Number },
    createdAt: { type: Number, required: true },
    updatedAt: { type: Number, required: true },
});

sessionSchema.index({ userId: 1, loginStatus: 1 })

export let Session = model<ISession>('Session', sessionSchema)
