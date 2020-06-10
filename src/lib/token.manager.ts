
'use strict';
import * as config from 'config';
import * as Constant from '../constants';
import * as Jwt from 'jsonwebtoken';
import * as ENTITY from '../entity';
import * as UniversalFunctions from '../utils';
const cert: any = config.get('jwtSecret.app.accessToken');
const adminCert: string = config.get('jwtSecret.admin.accessToken');
import * as utils from '../utils';

export let setToken = async (tokenData: any) => {
	console.log('tokenDatatokenDatatokenData', tokenData);

	if (!tokenData.id) {
		return Promise.reject(Constant.STATUS_MSG.ERROR.E501.TOKENIZATION_ERROR);
	} else {
		try {
			const tokenToSend = Jwt.sign(tokenData, cert, { algorithm: 'HS256' });
			return { accessToken: tokenToSend };
		} catch (error) {
			return Promise.reject(Constant.STATUS_MSG.ERROR.E501.TOKENIZATION_ERROR);
		}
	}
};

export let verifyToken = async (token, tokenType, request?: any) => {
	try {
		let result;
		try {
			result = Jwt.verify(token, cert, { algorithms: ['HS256'] });
		} catch (error) {
			return UniversalFunctions.sendError(Constant.STATUS_MSG.ERROR.E401.INVALID_TOKEN);
		}
		utils.consolelog('resultToken', result, true);
		if (result) {
			if (result !== {}) {
				const userData: any = {};
				const userCriteria = { _id: result.id };
				const checkUserExist = await ENTITY.UserE.getOneEntity(userCriteria, {});
				if (!checkUserExist) {
					return Promise.reject(Constant.STATUS_MSG.ERROR.E401.INVALID_TOKEN);
				}
				const sessionCriteria = {
					userId: result.id,
					loginStatus: true,
				};
				const checkValidSession = await ENTITY.SessionE.getOneEntity(sessionCriteria, {});
				if (!checkValidSession) {
					return Promise.reject(Constant.STATUS_MSG.ERROR.E401.INVALID_TOKEN);
				}
				userData.id = checkUserExist._id;
				userData.type = tokenType;
				userData.userData = checkUserExist;
				return userData;
			} else {
				return Promise.reject(Constant.STATUS_MSG.ERROR.E401.INVALID_TOKEN);
			}
		} else {
			return UniversalFunctions.sendError(Constant.STATUS_MSG.ERROR.E401.INVALID_TOKEN);
		}
	} catch (error) {
		UniversalFunctions.consolelog('error', error, true);
		return Promise.reject(Constant.STATUS_MSG.ERROR.E401.INVALID_TOKEN);
	}
};

export let verifyAdminToken = async (token, tokenType, request?: any) => {
	try {
		const result: any = Jwt.verify(token, adminCert, { algorithms: ['HS256'] });
		if (!result) { return Promise.reject(Constant.STATUS_MSG.ERROR.E401.INVALID_TOKEN); }
		const adminData: any = {};
		const criteria = { _id: result._id };
		const checkAdminExist = await ENTITY.AdminE.getOneEntity(criteria, {});
		if (!checkAdminExist) { return Promise.reject(Constant.STATUS_MSG.ERROR.E401.INVALID_TOKEN); }
		const sessionCriteria = {
			adminId: result._id,
			isLogin: true,
		};
		const checkValidSession = await ENTITY.AdminSessionE.getOneEntity(sessionCriteria, {});
		if (!checkValidSession) {
			return Promise.reject(Constant.STATUS_MSG.ERROR.E401.INVALID_TOKEN);
		}
		adminData.id = checkAdminExist._id;
		adminData.adminData = checkAdminExist;
		adminData.permission = checkAdminExist.permission;
		adminData.type = checkAdminExist.type;
		return adminData;

	} catch (error) {
		return Promise.reject(Constant.STATUS_MSG.ERROR.E401.INVALID_TOKEN);
	}
};

export let decodeToken = async (token: string) => {
	const decodedData = Jwt.verify(token, cert, { algorithms: ['HS256'] });
	if (decodedData) {
		return decodedData;
	} else {
		return Promise.reject(Constant.STATUS_MSG.ERROR.E401.INVALID_TOKEN);
	}
};

export let generateToken = (data): string => {
	return Jwt.sign(data, cert, { algorithm: 'HS256' });
};
