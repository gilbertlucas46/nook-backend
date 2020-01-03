"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_entity_1 = require("../base.entity");
const mongoose = require("mongoose");
class AdminSessionClass extends base_entity_1.BaseEntity {
    constructor() {
        super("AdminSession");
    }
    async createSession(sessionData) {
        try {
            let sessionInfo = {
                _id: mongoose.Types.ObjectId().toString(),
                adminId: sessionData.adminId,
                isLogin: true,
                createdAt: new Date().getTime(),
                updatedAt: new Date().getTime(),
            };
            let session = await this.DAOManager.saveData(this.modelName, sessionInfo);
            if (session && session._id)
                return session;
        }
        catch (error) {
            return Promise.reject(error);
        }
    }
}
exports.AdminSessionClass = AdminSessionClass;
exports.AdminSessionE = new AdminSessionClass();
//# sourceMappingURL=adminSession.entity.js.map