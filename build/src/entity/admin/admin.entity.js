'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const base_entity_1 = require("../base.entity");
const config = require("config");
const Jwt = require("jsonwebtoken");
const cert = config.get('jwtSecret');
const utils = require("../../utils");
class AdminClass extends base_entity_1.BaseEntity {
    constructor() {
        super('Admin');
    }
    async createAdmin(adminData) {
        try {
            let dataToInsert = {
                email: adminData.email,
                firstName: adminData.firstName,
                lastName: adminData.lastName,
                phoneNumber: adminData.phoneNumber,
            };
            let admin = await this.createOneEntity(dataToInsert);
            return admin;
        }
        catch (error) {
            return Promise.reject(error);
        }
    }
    async adminAccountCreator() {
        let to_save = {
            name: 'Base Admin',
            email: 'base_admin@yopmail.com',
            password: await utils.cryptData('123456'),
            profilePicUrl: ''
        };
        let criteria = {
            email: 'base_admin@yopmail.com'
        };
        let theData = await this.getOneEntity(criteria, {});
        if (!theData)
            await this.createOneEntity(to_save);
        return '__ADMIN ACCOUNT LOOKUP/CREATION DONE__';
    }
    async createToken(adminData) {
        try {
            const accessToken = Jwt.sign({ sessionId: adminData.sessionId, timestamp: Date.now(), _id: adminData.adminId }, cert);
            return accessToken;
        }
        catch (error) {
            return Promise.reject(error);
        }
    }
    async createPasswordResetToken(adminData) {
        try {
            let tokenToSend = await Jwt.sign(adminData.email, cert, { algorithm: 'HS256' });
            let expirationTime = new Date(new Date().getTime() + 10 * 60 * 1000);
            let criteriaForUpdatePswd = { _id: adminData._id };
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
exports.AdminClass = AdminClass;
exports.AdminE = new AdminClass();
//# sourceMappingURL=admin.entity.js.map