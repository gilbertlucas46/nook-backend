"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
;
const sessionSchema = new mongoose_1.Schema({
    _id: { type: mongoose_1.Schema.Types.ObjectId, required: true, },
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
    validAttempt: { type: Boolean, required: true, default: false },
    ipAddress: { type: String },
    deviceToken: { type: String },
    source: { type: String },
    loginStatus: { type: Boolean, required: true, default: true },
    lastActivityTime: { type: Number },
    createdAt: { type: Number, required: true },
    updatedAt: { type: Number, required: true },
});
sessionSchema.index({ userId: 1, loginStatus: 1 });
exports.Session = mongoose_1.model('Session', sessionSchema);
//# sourceMappingURL=session.model.js.map