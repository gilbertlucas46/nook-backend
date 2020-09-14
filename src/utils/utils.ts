import * as config from 'config';
import * as Joi from 'joi';
import * as Boom from 'boom';
import * as CONSTANT from '../constants';
import * as crypto from 'crypto';
import * as randomstring from 'randomstring';
import { isArray } from 'util';
import { logger } from '../lib/logger.manager'
const displayColors = config.get('displayColors');
import * as hasher from 'wordpress-hash-node';
import * as request from 'request';

export let sendError = (data: any) => {
	if (
		typeof data === 'object' &&
		data.hasOwnProperty('statusCode') &&
		(data.hasOwnProperty('message') || data.hasOwnProperty('customMessage'))
	) {
		let errorToSend: Boom;
		const error = new Error(data.message);
		errorToSend = Boom.boomify(error, { statusCode: data.statusCode });
		(errorToSend.output.payload as any).responseType = data.type;
		logger.log('info', `message - ${data.message}, time-${new Date().toISOString()}`);
		return errorToSend;
	} else {
		let errorToSend = '';
		if (typeof data === 'object') {

			// logger.log('DB_ERROR', `message - ${data.message}, time-${new Date().toISOString()}`);
			if (data.name === 'MongoError') {
				errorToSend += CONSTANT.STATUS_MSG.ERROR.E400.DB_ERROR.message + CONSTANT.STATUS_MSG.ERROR.ENQUIRY_ALREADY_SENT;
				//logger for mongoerror (error in query)
				logger.log('DB_ERROR', `message - ${data.message}, time-${new Date().toISOString()}`);
			} else if (data.name === 'ApplicationError') {
				logger.log('info', `message - ${data.message}, time-${new Date().toISOString()}`);
				errorToSend += CONSTANT.STATUS_MSG.ERROR.E400.APP_ERROR.message + ' : ';
			} else if (data.name === 'ValidationError') {
				logger.log('info', `message - ${data.message}, time-${new Date().toISOString()}`);
				errorToSend += CONSTANT.STATUS_MSG.ERROR.E400.VALIDATION_ERROR.message + data.message;
			} else if (data.name === 'CastError') {
				// logger for cast error (id not valid)
				logger.log('info', `message - ${data.message}, time-${new Date().toISOString()}`)
				errorToSend += CONSTANT.STATUS_MSG.ERROR.E400.DB_ERROR.message + CONSTANT.STATUS_MSG.ERROR.E400.INVALID_ID.message + data.value;
			}
			else if (data.code === 'card_error') {
				errorToSend += CONSTANT.STATUS_MSG.ERROR.E400.DB_ERROR.message + data.message + data.message;
			}
			else {
				logger.log('info', `message - ${data}, time-${new Date().toISOString()}`);

			}
		} else {
			logger.log('info', `message - ${data}, time-${new Date().toISOString()}`);
			errorToSend = data;
		}
		let customErrorMessage = errorToSend;
		if (typeof customErrorMessage === 'string') {
			if (errorToSend.indexOf('[') > -1) {
				customErrorMessage = errorToSend.substr(errorToSend.indexOf('['));
			}
			customErrorMessage = customErrorMessage && customErrorMessage.replace(/'/g, '');
			customErrorMessage = customErrorMessage && customErrorMessage.replace('[', '');
			customErrorMessage = customErrorMessage && customErrorMessage.replace(']', '');
			logger.log('DB_ERROR', `message - ${data.message}, time-${new Date().toISOString()}`);
		}
		throw Boom.badRequest(customErrorMessage);
	}
};

export let sendSuccess = (successMsg: any, data: any) => {
	if (typeof data === 'object' && data.hasOwnProperty('password')) {
		delete data.password;
	}
	if (typeof data === 'object' && data.hasOwnProperty('statusCode') && data.hasOwnProperty('message')) {
		return { statusCode: data.statusCode, message: data.message, type: data.type, data: data.data || null };

	} else if (successMsg != null && typeof successMsg === 'object' && successMsg.hasOwnProperty('statusCode') && successMsg.hasOwnProperty('message')) {
		successMsg = successMsg || CONSTANT.STATUS_MSG.SUCCESS.S200.DEFAULT.message;
		return { statusCode: successMsg.statusCode, message: successMsg.message, data: data || null, type: (data.type) ? data.type : CONSTANT.STATUS_MSG.SUCCESS.S200.DEFAULT.type };

	} else {
		successMsg = successMsg || CONSTANT.STATUS_MSG.SUCCESS.S200.DEFAULT.message;
		return { statusCode: 200, message: successMsg, data: data || null, type: (data.type) ? data.type : '' };
	}
};

export let authorizationHeaderObj = Joi.object({
	authorization: Joi.string().required().description('bearer space accessToken'),
}).unknown();

export let cryptData = async (stringToCrypt: string) => {
	const hmac = crypto.createHmac('sha256', config.get('cryptoSecret'));
	const crypted = hmac.update(stringToCrypt).digest('hex');
	return crypted;
};

export let deCryptData = async (stringToCheck: string, dbString: string) => {
	const hmac = crypto.createHmac('sha256', config.get('cryptoSecret'));
	const crypted = hmac.update(stringToCheck).digest('hex');
	return (dbString === crypted) ? true : false;
};

export let encryptWordpressHashNode = async (stringToCrypt: string) => {
	return await hasher.HashPassword(stringToCrypt);
};

export let decryptWordpressHashNode = async (stringToCheck: string, dbString: string) => {
	return await hasher.CheckPassword(stringToCheck, dbString);
};

export let cipherText = async (text: string) => {
	const cipher = crypto.createCipher('aes-128-ctr', config.get('cryptoSecret'));
	let crypted = cipher.update(text, 'utf8', 'hex');
	crypted += cipher.final('hex');
	return crypted;
};

export let deCipherText = async (text: string) => {
	const decipher = crypto.createDecipher('aes-128-ctr', config.get('cryptoSecret'));
	let dec = decipher.update(text, 'hex', 'utf8');
	dec += decipher.final('utf8');
	return dec;
};

export let generateOtp = async () => {
	const otp = (Math.floor(1000 + Math.random() * 9000));
	return otp;
};

export let formatUserData = (userObj: { [key: string]: any }) => {
	if (userObj.emailVerify) {
		userObj.emailVerify = userObj.emailVerify.status;
	}
	if (userObj.phoneVerify) {
		userObj.phoneVerify = userObj.phoneVerify.status;
	}

	delete userObj.isLogin;
	delete userObj.lastActivityTime;
	delete userObj.password;
	delete userObj.passwordResetToken;
	delete userObj.passwordResetTokenExpirationTime;
	delete userObj.propertyActions;
	delete userObj.actions;
	return userObj;
};

export let validateLocation = (lat: number, long: number) => {
	let valid = true;
	if (lat < -90 || lat > 90) {
		valid = false;
	}
	if (long < -180 || long > 180) {
		valid = false;
	}
	return valid;
};

export function sleep(ms: number) {
	return new Promise((resolve, reject) => setTimeout(resolve, ms));
}

export let generateRandomString = (digits: number) => {
	return randomstring.generate(digits);
};

export let failActionFunction = async (request: any, h: any, err: any) => {
	let customErrorMessage = '';
	if (err.name === 'ValidationError') {
		customErrorMessage = err.details[0].message;
	} else {
		customErrorMessage = err.output.payload.message;
	}
	customErrorMessage = customErrorMessage.replace(/'/g, '');
	customErrorMessage = customErrorMessage.replace('[', '');
	customErrorMessage = customErrorMessage.replace(']', '');
	return Boom.badRequest(customErrorMessage);
};

export let consolelog = (identifier: string, value: any, status: boolean) => {
	try {
		if (isArray(value)) {
			value.forEach((obj, i) => {
				if (status) {
					// logger.log('DB_ERROR', `message - ${data.message}, time-${new Date().toISOString()}`)
					console.info(displayColors ? '\x1b[31m%s\x1b[0m' : '%s', '<--------------' + identifier + '--------------' + i + '-------------->', obj);
				} else {
					console.error(displayColors ? '\x1b[31m%s\x1b[0m' : '%s', '<--------------' + identifier + '--------------' + i + '-------------->', obj);
				}
			});
			return;
		} else {
			if (status) {
				console.info(displayColors ? '\x1b[31m%s\x1b[0m' : '%s', '<--------------' + identifier + '-------------->', value);
			} else {
				console.error(displayColors ? '\x1b[31m%s\x1b[0m' : '%s', '<--------------' + identifier + '-------------->', value);
			}
			return;
		}
	} catch (error) {
		console.log('Error in logging console', error);
		return;
	}
};

export let invoiceNumber = (value) => {
	return 'INV' + new Date().getFullYear() + ('00000000' + value).slice(-8);
};

export let errorReporter = async (data) => {
	try {
		console.log('config.get,config.get,', config.get('flock'), data);

		let postThisData = {
			url: "https://api.flock.com/hooks/sendMessage/68a7b63d-4b1e-4a02-b4c9-0f6a91aa6a27", // config.get('flock'),
			body: JSON.stringify({ flockml: data }),
			headers: { 'Content-Type': 'application/json' }
		}
		request.post(postThisData, (err, response, body) => {
			if (err) {
				console.log(err);
			} else {
				console.log(body)
			}
		});
	} catch (error) {
		console.log('Error inside errorReporter', error);
	}
}
export let incrementNumber = (value) => { return value; };