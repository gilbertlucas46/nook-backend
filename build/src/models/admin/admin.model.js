"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
exports.AdminSchema = new mongoose_1.Schema({
    _id: { type: mongoose_1.Schema.Types.ObjectId, required: true, auto: true },
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
}, { timestamps: true });
exports.Admin = mongoose_1.model('Admin', exports.AdminSchema);
//# sourceMappingURL=admin.model.js.map