"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = require("config");
const Constant = require("../../constants/app.constant");
const ENTITY = require("../../entity");
const utils = require("../../utils/index");
const Jwt = require("jsonwebtoken");
const cert = config.get('jwtSecret');
const mail_manager_1 = require("../../lib/mail.manager");
class AdminProfileController {
    constructor() { }
    async login(payload) {
        try {
            let email = payload.email;
            if (email)
                email = email.trim().toLowerCase();
            let checkData = { email };
            let adminData = await ENTITY.AdminE.getOneEntity(checkData, ['password', '_id', 'email']);
            if (!adminData)
                return Promise.reject(Constant.STATUS_MSG.ERROR.E400.INVALID_EMAIL);
            if (!(await utils.deCryptData(payload.password, adminData.password)))
                return Promise.reject(Constant.STATUS_MSG.ERROR.E400.INVALID_CURRENT_PASSWORD);
            let sessionData = { adminId: adminData._id };
            let sessionObj = await ENTITY.AdminSessionE.createSession(sessionData);
            let tokenObj = {
                adminId: adminData._id,
                sessionId: sessionObj._id
            };
            let accessToken = await ENTITY.AdminE.createToken(tokenObj);
            return { formatedData: adminData, accessToken: accessToken };
        }
        catch (err) {
            return Promise.reject(err);
        }
    }
    async profile(payload) {
        try {
            let criteria = {
                _id: payload._id
            };
            let adminData = await ENTITY.AdminE.getData(criteria, ["email", "_id", "phoneNumber", "countryCode"]);
            return adminData;
        }
        catch (err) {
            return Promise.reject(err);
        }
    }
    async editProfile(payload, adminData) {
        try {
            let criteria = {
                _id: adminData._id
            };
            let updateAdmin = await ENTITY.AdminE.updateOneEntity(criteria, payload);
            return updateAdmin;
        }
        catch (err) {
            return Promise.reject(err);
        }
    }
    async forgetPassword(payload) {
        try {
            let criteria = {
                email: payload.email.trim().toLowerCase()
            };
            let adminData = await ENTITY.AdminE.getData(criteria, ["email", "_id"]);
            if (!adminData)
                return Promise.reject(Constant.STATUS_MSG.ERROR.E400.INVALID_EMAIL);
            else {
                let passwordResetToken = await ENTITY.AdminE.createPasswordResetToken(adminData);
                let url = config.get("host") + "/v1/user/verifyLink/" + passwordResetToken;
                let html = '<html><head><title> Nook Admin | Forget Password</title></head><body>Please click here : <a href="' + url + '">click</a></body></html>';
                let mail = new mail_manager_1.MailManager(payload.email, "forget password", html);
                mail.sendMail();
                return {};
            }
        }
        catch (error) {
            utils.consolelog('error', error, true);
            return Promise.reject(error);
        }
    }
    async changePassword(payload, adminData) {
        try {
            let criteria = {
                _id: adminData._id
            };
            let password = await ENTITY.AdminE.getOneEntity(criteria, ['password']);
            if (!(await utils.deCryptData(payload.oldPassword, password.password)))
                return Promise.reject(Constant.STATUS_MSG.ERROR.E400.INVALID_CURRENT_PASSWORD);
            else {
                let updatePswd = {
                    password: await utils.cryptData(payload.newPassword),
                    updatedAt: new Date().getTime()
                };
                let updatePassword = await ENTITY.AdminE.updateOneEntity(criteria, updatePswd);
                if (!updatePassword)
                    return Promise.reject(Constant.STATUS_MSG.ERROR.E500.IMP_ERROR);
                else
                    return Constant.STATUS_MSG.SUCCESS.S200.DEFAULT;
            }
        }
        catch (error) {
            return Promise.reject(error);
        }
    }
    async verifyLinkForResetPwd(payload) {
        try {
            let result = await Jwt.verify(payload['link'], cert, { algorithms: ['HS256'], });
            if (!result)
                return Promise.reject();
            let checkAlreadyUsedToken = await ENTITY.AdminE.getOneEntity({ email: result }, ['passwordResetTokenExpirationTime', 'passwordResetToken']);
            if (checkAlreadyUsedToken.passwordResetTokenExpirationTime == null && !checkAlreadyUsedToken.passwordResetToken == null)
                return Promise.reject("Already_Changed");
            let updatePswd = {
                password: await utils.cryptData(payload.password),
                updatedAt: new Date().getTime(),
                passwordResetTokenExpirationTime: null,
                passwordResetToken: null
            };
            let today = new Date();
            let diffMs = (today - checkAlreadyUsedToken.passwordResetTokenExpirationTime);
            let diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000);
            if (diffMins > 0)
                return Promise.reject("Time_Expired");
            else {
                let updatePassword = await ENTITY.AdminE.updateOneEntity({ email: result }, updatePswd);
                if (!updatePassword)
                    return Promise.reject(Constant.STATUS_MSG.ERROR.E500.IMP_ERROR);
                else
                    return Constant.STATUS_MSG.SUCCESS.S200.DEFAULT;
            }
        }
        catch (error) {
            utils.consolelog('error', error, true);
            return Promise.reject(error);
        }
    }
    async verifyLink(payload) {
        try {
            let result = await Jwt.verify(payload.link, cert, { algorithms: ['HS256'] });
            let adminData = await ENTITY.AdminE.getOneEntity(result.email, {});
            if (!adminData)
                return Constant.STATUS_MSG.ERROR.E500.IMP_ERROR;
            else {
                let criteria = { email: result };
                let userAttribute = ['passwordResetTokenExpirationTime', 'passwordResetToken'];
                let userExirationTime = await ENTITY.AdminE.getOneEntity(criteria, ['passwordResetTokenExpirationTime', 'passwordResetToken']);
                let today = new Date();
                let diffMs = (today - userExirationTime.passwordResetTokenExpirationTime);
                let diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000);
                if (diffMins > 0)
                    return Promise.reject('LinkExpired');
                else
                    return {};
            }
        }
        catch (error) {
            utils.consolelog('error', error, true);
            return Promise.reject(error);
        }
    }
}
exports.AdminProfileController = AdminProfileController;
exports.AdminProfileService = new AdminProfileController();
//# sourceMappingURL=adminProfile.controller.js.map