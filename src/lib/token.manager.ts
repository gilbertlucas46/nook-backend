
'use strict';
import * as config from 'config';
import * as Constant from '../constants';
import * as Jwt from 'jsonwebtoken';
import * as ENTITY from '../entity';
import * as UniversalFunctions from '../utils';
const cert: any = config.get('jwtSecret');
import * as utils from '../utils';
export let setToken = async (tokenData: any) => {
	if (!tokenData.id || !tokenData.tokenType) {
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
		const result: any = Jwt.verify(token, cert, { algorithms: ['HS256'] });
		utils.consolelog('resultToken', result, true);
		if (result.tokenType) {
			if (result.tokenType === 'TENANT' || 'AGENT' || 'OWNER') {
				const userData: any = {};
				const userCriteria = { _id: result.id };
				const checkUserExist = await ENTITY.UserE.getOneEntity(userCriteria, {});
				if (!checkUserExist) {
					return Constant.STATUS_MSG.ERROR.E401.INVALID_TOKEN;
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
				return Constant.STATUS_MSG.ERROR.E401.INVALID_TOKEN;
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
		const result: any = Jwt.verify(token, cert, { algorithms: ['HS256'] });
		if (!result) { return Constant.STATUS_MSG.ERROR.E401.INVALID_TOKEN; }
		const adminData: any = {};
		const criteria = { _id: result._id };
		const checkAdminExist = await ENTITY.AdminE.getOneEntity(criteria, {});
		if (!checkAdminExist) { return Constant.STATUS_MSG.ERROR.E401.INVALID_TOKEN; }
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
