"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const mongoose_1 = require("mongoose");
const CONSTANT = require("../constants/app.constant");
const userSchema = new mongoose_1.Schema({
    userName: { type: String, index: true, unique: true },
    email: { type: String, trim: true, index: true, unique: true },
    password: { type: String, trim: true },
    firstName: { type: String, },
    lastName: { type: String, },
    phoneNumber: { type: String, },
    title: { type: String },
    license: { type: String },
    taxnumber: { type: String },
    faxNumber: { type: String },
    fullPhoneNumber: { type: String },
    language: { type: String },
    companyName: { type: String },
    address: {
        type: String
    },
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
    createdAt: { type: Number, default: new Date().getTime() },
    updatedAt: { type: Number, default: new Date().getTime() },
    type: {
        type: String,
        enum: [
            CONSTANT.DATABASE.USER_TYPE.AGENT.TYPE,
            CONSTANT.DATABASE.USER_TYPE.OWNER.TYPE,
            CONSTANT.DATABASE.USER_TYPE.TENANT.TYPE,
            CONSTANT.DATABASE.USER_TYPE.GUEST.TYPE
        ],
        default: CONSTANT.DATABASE.USER_TYPE.TENANT.TYPE
    },
    isProfileComplete: { type: Boolean, default: false },
    passwordResetToken: { type: String },
    passwordResetTokenExpirationTime: { type: Date },
    isFeaturedProfile: { type: Boolean, default: false },
});
exports.User = mongoose.model("User", userSchema);
//# sourceMappingURL=user.model.js.map