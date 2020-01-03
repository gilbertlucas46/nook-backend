'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const config = require("config");
const Constant = require("../constants");
const Jwt = require("jsonwebtoken");
const ENTITY = require("../entity");
const cert = config.get('jwtSecret');
const UniversalFunctions = require("../utils");
exports.setToken = async function (tokenData) {
    if (!tokenData.id || !tokenData.tokenType) {
        return Promise.reject(Constant.STATUS_MSG.ERROR.E501.TOKENIZATION_ERROR);
    }
    else {
        try {
            let tokenToSend = await Jwt.sign(tokenData, cert, { algorithm: 'HS256' });
            return { accessToken: tokenToSend };
        }
        catch (error) {
            return Promise.reject(Constant.STATUS_MSG.ERROR.E501.TOKENIZATION_ERROR);
        }
    }
};
exports.verifyToken = async function (token, tokenType, request) {
    try {
        let result = await Jwt.verify(token, cert, { algorithms: ['HS256'] });
        if (result['tokenType'] != undefined) {
            if (result['tokenType'] == 'TENANT' || "AGENT" || "OWNER") {
                let userData = {};
                let userCriteria = { _id: result['id'] };
                let checkUserExist = await ENTITY.UserE.getOneEntity(userCriteria, {});
                if (!checkUserExist)
                    return Constant.STATUS_MSG.ERROR.E401.INVALID_TOKEN;
                let sessionCriteria = {
                    userId: result['id'],
                    loginStatus: true
                };
                let checkValidSession = await ENTITY.SessionE.getOneEntity(sessionCriteria, {});
                if (!checkValidSession)
                    return Promise.reject(Constant.STATUS_MSG.ERROR.E401.INVALID_TOKEN);
                userData['id'] = checkUserExist['_id'];
                userData['type'] = tokenType;
                userData['userData'] = checkUserExist;
                return userData;
            }
            else {
                return Constant.STATUS_MSG.ERROR.E401.INVALID_TOKEN;
            }
        }
        else {
            const result = await UniversalFunctions.sendError(Constant.STATUS_MSG.ERROR.E401.INVALID_TOKEN);
            return Promise.reject(result);
        }
    }
    catch (error) {
        UniversalFunctions.consolelog('error', error, true);
        return Promise.reject(Constant.STATUS_MSG.ERROR.E401.INVALID_TOKEN);
    }
};
exports.verifyAdminToken = async function (token, tokenType, request) {
    try {
        let result = await Jwt.verify(token, cert, { algorithms: ['HS256'] });
        if (!result)
            return Constant.STATUS_MSG.ERROR.E401.INVALID_TOKEN;
        let adminData = {};
        let criteria = { _id: result['_id'] };
        let checkAdminExist = await ENTITY.AdminE.getOneEntity(criteria, {});
        if (!checkAdminExist)
            return Constant.STATUS_MSG.ERROR.E401.INVALID_TOKEN;
        let sessionCriteria = {
            adminId: result['_id'],
            isLogin: true
        };
        let checkValidSession = await ENTITY.AdminSessionE.getOneEntity(sessionCriteria, {});
        if (!checkValidSession)
            return Promise.reject(Constant.STATUS_MSG.ERROR.E401.INVALID_TOKEN);
        adminData['id'] = checkAdminExist['_id'];
        adminData['adminData'] = checkAdminExist;
        return adminData;
    }
    catch (error) {
        return Promise.reject(Constant.STATUS_MSG.ERROR.E401.INVALID_TOKEN);
    }
};
exports.decodeToken = async function (token) {
    let decodedData = Jwt.verify(token, cert, { algorithms: ['HS256'] });
    if (decodedData) {
        return decodedData;
    }
    else {
        return Promise.reject(Constant.STATUS_MSG.ERROR.E401.INVALID_TOKEN);
    }
};
//# sourceMappingURL=token.manager.js.map