'use strict'
import * as config from 'config'
import * as Joi from 'joi'
import * as Boom from 'boom'
import * as CONSTANT from '../constants'
import * as crypto from 'crypto'
import * as randomstring from 'randomstring';
import { isArray } from 'util';
const displayColors = config.get("displayColors");

export let sendError = function (data) {
    if (typeof data === 'object' && data.hasOwnProperty('statusCode') && (data.hasOwnProperty('message') || data.hasOwnProperty('customMessage'))) {
        let errorToSend
        if (data.hasOwnProperty('message')) {
            let error = new Error(data.message);
            errorToSend = Boom.boomify(error, { statusCode: data.statusCode })
        } else {
            let error = new Error(data.message);
            errorToSend = Boom.boomify(error, { statusCode: data.statusCode })
        }
        errorToSend.output.payload.responseType = data.type
        return errorToSend
    } else {
        let errorToSend = ''
        if (typeof data === 'object') {
            if (data.name === 'MongoError') {
                errorToSend += CONSTANT.STATUS_MSG.ERROR.E400.DB_ERROR.message + data.errmsg
            } else if (data.name === 'ApplicationError') {
                errorToSend += CONSTANT.STATUS_MSG.ERROR.E400.APP_ERROR.message + ' : '
            } else if (data.name === 'ValidationError') {
                errorToSend += CONSTANT.STATUS_MSG.ERROR.E400.VALIDATION_ERROR.message + data.message
            } else if (data.name === 'CastError') {
                errorToSend += CONSTANT.STATUS_MSG.ERROR.E400.DB_ERROR.message + CONSTANT.STATUS_MSG.ERROR.E400.INVALID_ID.message + data.value
            }
        } else {
            errorToSend = data
        }
        var customErrorMessage = errorToSend
        if (typeof customErrorMessage === 'string') {
            if (errorToSend.indexOf("[") > -1) {
                customErrorMessage = errorToSend.substr(errorToSend.indexOf("["))
            }
            customErrorMessage = customErrorMessage && customErrorMessage.replace(/"/g, '')
            customErrorMessage = customErrorMessage && customErrorMessage.replace('[', '')
            customErrorMessage = customErrorMessage && customErrorMessage.replace(']', '')
        }
        throw Boom.badRequest(customErrorMessage)
    }
}

export let sendSuccess = function (successMsg, data) {
    if (typeof data === 'object' && data.hasOwnProperty('password')) {
        delete data['password']
    }
    if (typeof data === 'object' && data.hasOwnProperty('statusCode') && data.hasOwnProperty('message')) {
        return { statusCode: data.statusCode, message: data.message, type: data.type, data: data.data || null }

    } else if (successMsg != null && typeof successMsg === 'object' && successMsg.hasOwnProperty('statusCode') && successMsg.hasOwnProperty('message')) {
        successMsg = successMsg || CONSTANT.STATUS_MSG.SUCCESS.S200.DEFAULT.message
        return { statusCode: successMsg.statusCode, message: successMsg.message, data: data || null, type: (data.type) ? data.type : CONSTANT.STATUS_MSG.SUCCESS.S200.DEFAULT.type }

    } else {
        successMsg = successMsg || CONSTANT.STATUS_MSG.SUCCESS.S200.DEFAULT.message
        return { statusCode: 200, message: successMsg, data: data || null, type: (data.type) ? data.type : "" }
    }
}

export let authorizationHeaderObj = Joi.object({
    authorization: Joi.string().required().description("bearer space accessToken")
}).unknown()

export let cryptData = async function (stringToCrypt: string) {
    let hmac = crypto.createHmac('sha256', config.get('cryptoSecret'));
    let crypted = hmac.update(stringToCrypt).digest('hex');
    return crypted;
}

export let deCryptData = async function (stringToCheck: string, dbString: string) {
    let hmac = crypto.createHmac('sha256', config.get('cryptoSecret'));
    let crypted = hmac.update(stringToCheck).digest('hex');
    return (dbString == crypted) ? true : false
}

export let cipherText = async function (text) {
    let cipher = crypto.createCipher('aes-128-ctr', config.get('cryptoSecret'))
    let crypted = cipher.update(text, 'utf8', 'hex')
    crypted += cipher.final('hex');
    return crypted;
}

export let deCipherText = async function (text) {
    var decipher = crypto.createDecipher('aes-128-ctr', config.get('cryptoSecret'))
    var dec = decipher.update(text, 'hex', 'utf8')
    dec += decipher.final('utf8');
    return dec;
}

export let generateOtp = async function () {
    let otp = (Math.floor(1000 + Math.random() * 9000));
    return otp
}

export let formatUserData = function (userObj: Object) {
    if (userObj['emailVerify'])
        userObj['emailVerify'] = userObj['emailVerify']['status']
    if (userObj['phoneVerify'])
        userObj['phoneVerify'] = userObj['phoneVerify']['status']

    delete userObj['isLogin']
    delete userObj['lastActivityTime']
    delete userObj['password']
    return userObj
}

export let validateLocation = function (lat, long) {
    var valid = true;
    if (lat < -90 || lat > 90) {
        valid = false;
    }
    if (long < -180 || long > 180) {
        valid = false;
    }
    return valid;
};

export function sleep(ms: number) {
    return new Promise((resolve, reject) => setTimeout(resolve, ms))
}

export let generateRandomString = function (digits: number) {
    return randomstring.generate(digits);
};

export let failActionFunction = async function (request, h, err) {
    let customErrorMessage = ""
    if (err.name === "ValidationError") {
        customErrorMessage = err.details[0].message
    } else {
        customErrorMessage = err.output.payload.message
    }
    customErrorMessage = customErrorMessage.replace(/"/g, '')
    customErrorMessage = customErrorMessage.replace('[', '')
    customErrorMessage = customErrorMessage.replace(']', '')
    return Boom.badRequest(customErrorMessage)
}

export let consolelog = function (identifier: string, value: any, status: boolean) {
    try {
        if (isArray(value)) {
            value.forEach((obj, i) => {
                if (status) {
                    console.info(displayColors ? "\x1b[31m%s\x1b[0m" : "%s", "<--------------" + identifier + "--------------" + i + "-------------->", obj);
                } else {
                    console.error(displayColors ? "\x1b[31m%s\x1b[0m" : "%s", "<--------------" + identifier + "--------------" + i + "-------------->", obj);
                }
            });
            return;
        } else {
            if (status) {
                console.info(displayColors ? "\x1b[31m%s\x1b[0m" : "%s", "<--------------" + identifier + "-------------->", value);
            } else {
                console.error(displayColors ? "\x1b[31m%s\x1b[0m" : "%s", "<--------------" + identifier + "-------------->", value);
            }
            return;
        }
    } catch (error) {
        console.log("error in consolelog", error);
        return;
    }
};
