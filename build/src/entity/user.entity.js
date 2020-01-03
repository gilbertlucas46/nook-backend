'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const base_entity_1 = require("./base.entity");
const config = require("config");
const TokenManager = require("../lib");
const Jwt = require("jsonwebtoken");
const cert = config.get('jwtSecret');
class UserClass extends base_entity_1.BaseEntity {
    constructor() {
        super('User');
    }
    async createUser(userData) {
        try {
            let dataToInsert = {
                name: userData.userName,
                email: userData.email,
                firstName: userData.firstName,
                lastName: userData.lastName,
                phoneNumber: userData.phoneNumber,
            };
            let user = await this.createOneEntity(dataToInsert);
            return user;
        }
        catch (error) {
            return Promise.reject(error);
        }
    }
    async createToken(payload, userData) {
        try {
            let sessionValid = {};
            if (userData.session) {
                sessionValid = {
                    session: userData.session
                };
            }
            let tokenData;
            tokenData = {
                id: userData._id,
                tokenType: userData.type,
                timestamp: new Date().getTime(),
                session: userData.session
            };
            let mergeData = Object.assign({}, tokenData, sessionValid);
            let accessToken = await TokenManager.setToken(mergeData);
            return accessToken["accessToken"];
        }
        catch (error) {
            return Promise.reject(error);
        }
    }
    async createPasswordResetToken(userData) {
        try {
            let tokenToSend = await Jwt.sign(userData.email, cert, { algorithm: 'HS256' });
            let expirationTime = new Date(new Date().getTime() + 10 * 60 * 1000);
            let criteriaForUpdatePswd = { _id: userData._id };
            let dataToUpdateForPswd = {
                passwordResetToken: tokenToSend,
                passwordResetTokenExpirationTime: expirationTime
            };
            await this.updateOneEntity(criteriaForUpdatePswd, dataToUpdateForPswd);
            return tokenToSend;
        }
        catch (error) {
            return Promise.reject(error);
        }
    }
    async getData(criteria, ProjectData) {
        try {
            let data = await this.DAOManager.findOne(this.modelName, criteria, ProjectData);
            return data;
        }
        catch (error) {
            Promise.reject(error);
        }
    }
}
exports.UserClass = UserClass;
exports.UserE = new UserClass();
//# sourceMappingURL=user.entity.js.map