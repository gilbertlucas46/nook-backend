"use strict";
import { BaseEntity } from "./base.entity";
import * as mongoose from "mongoose";

export class SessionClass extends BaseEntity {
    constructor() {
        super("Session");
    }

    async createSession(sessionData: UserRequest.Session, userData, accessToken: string, type: string) {
        try {
            let columnName: string;
            let sessionInfo = {
                _id: mongoose.Types.ObjectId().toString(),
                userId: userData._id,
                deviceId: sessionData.deviceId,
                deviceType: sessionData.deviceType,
                validAttempt: accessToken ? true : false,
                ipAddress: sessionData.ipAddress,
                source: sessionData.source,
                loginStatus: true,
                createdAt: new Date().getTime(),
                updatedAt: new Date().getTime(),
                deviceToken: sessionData.deviceToken,
            };

            if (type == 'user') {
                columnName = 'userId';
                sessionInfo[columnName] = userData._id;
            }
            // else if (type == 'merchant') {
            //     columnName = 'merchantId';
            //     sessionInfo[columnName] = userData._id;
            // }

            if (sessionData.deviceToken)
                sessionInfo.deviceToken = sessionData.deviceToken;
            let session = await this.DAOManager.saveData(this.modelName, sessionInfo);

            if (session && session._id) return session;
        } catch (error) {
            console.log("-------------createSession-----error------------------", error);
            return Promise.reject(error);
        }
    }
}

export let SessionE = new SessionClass();