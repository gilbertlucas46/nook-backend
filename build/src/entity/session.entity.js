"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_entity_1 = require("./base.entity");
const mongoose = require("mongoose");
class SessionClass extends base_entity_1.BaseEntity {
    constructor() {
        super("Session");
    }
    async createSession(sessionData, userData, accessToken, type) {
        try {
            let columnName;
            let sessionInfo = {
                _id: mongoose.Types.ObjectId().toString(),
                userId: userData._id,
                validAttempt: accessToken ? true : false,
                source: sessionData.source,
                loginStatus: true,
                createdAt: new Date().getTime(),
                updatedAt: new Date().getTime(),
            };
            if (type == 'user') {
                columnName = 'userId';
                sessionInfo[columnName] = userData._id;
            }
            let session = await this.DAOManager.saveData(this.modelName, sessionInfo);
            if (session && session._id)
                return session;
        }
        catch (error) {
            return Promise.reject(error);
        }
    }
}
exports.SessionClass = SessionClass;
exports.SessionE = new SessionClass();
//# sourceMappingURL=session.entity.js.map