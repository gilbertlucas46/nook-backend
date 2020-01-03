"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
exports.AdminSessionSchema = new mongoose_1.Schema({
    _id: { type: mongoose_1.Schema.Types.ObjectId, required: true, auto: true },
    adminId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        index: true,
        ref: 'Admin',
    },
    isDeleted: { type: Boolean, default: false },
    lastActiveTime: { type: Date },
    isLogin: { type: Boolean, default: false },
}, { timestamps: true });
exports.AdminSession = mongoose_1.model('AdminSession', exports.AdminSessionSchema);
//# sourceMappingURL=adminSession.model.js.map