'use strict';
import * as config from 'config';
import * as Constant from '../constants'
import * as Jwt from 'jsonwebtoken';
import * as ENTITY from '../entity';
const cert = config.get('jwtSecret');
import * as UniversalFunctions from '../utils';

export let setToken = async function (tokenData: any) {
    if (!tokenData.id || !tokenData.tokenType) {
        return Promise.reject(Constant.STATUS_MSG.ERROR.E501.TOKENIZATION_ERROR)
    } else {
        try {
            let tokenToSend = await Jwt.sign(tokenData, cert, { algorithm: 'HS256' });
            return { accessToken: tokenToSend }
        } catch (error) {
            return Promise.reject(Constant.STATUS_MSG.ERROR.E501.TOKENIZATION_ERROR)
        }
    }
};

export let verifyToken = async function (token, tokenType, request?: any) {
    try {
        let result = await Jwt.verify(token, cert, { algorithms: ['HS256'] });
        if (result['tokenType'] != undefined) {
            if (result['tokenType'] == 'TENANT' || "AGENT" || "OWNER") {
                let userData = {};
                let userCriteria = { _id: result['id'] }
                let checkUserExist = await ENTITY.UserE.getOneEntity(userCriteria, {});
                if (!checkUserExist)
                    return Promise.reject(Constant.STATUS_MSG.ERROR.E401.INVALID_TOKEN);
                let sessionCriteria = {
                    userId: result['id'],
                    loginStatus: true
                };
                let checkValidSession = await ENTITY.SessionE.getOneEntity(sessionCriteria, {})
                if (!checkValidSession)
                    return Promise.reject(Constant.STATUS_MSG.ERROR.E401.INVALID_TOKEN)
                userData['id'] = checkUserExist['_id'];
                userData['type'] = tokenType;
                userData['userData'] = checkUserExist
                return userData
            } else {
                return Constant.STATUS_MSG.ERROR.E401.INVALID_TOKEN
            }
        }
        else {
            const result = await UniversalFunctions.sendError(Constant.STATUS_MSG.ERROR.E401.INVALID_TOKEN);
            return Promise.reject(result);
        }
    } catch (error) {
        return Promise.reject(Constant.STATUS_MSG.ERROR.E401.INVALID_TOKEN)
    }
};

export let decodeToken = async function (token: string) {
    let decodedData = Jwt.verify(token, cert, { algorithms: ['HS256'] })
    if (decodedData) {
        return decodedData
    } else {
        return Promise.reject(Constant.STATUS_MSG.ERROR.E401.INVALID_TOKEN)
    }
};