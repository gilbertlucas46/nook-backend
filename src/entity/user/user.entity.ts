import { BaseEntity } from '@src/entity/base/base.entity';
import * as config from 'config';
import * as TokenManager from '@src/lib';
import * as Jwt from 'jsonwebtoken';
const pswdCert: string = config.get('jwtSecret.app.forgotToken');
import { UserRequest } from '@src/interfaces/user.interface';
import * as Constant from '@src/constants';
import { Types } from 'mongoose';
import { flattenObject } from '@src/utils';
import fetch from 'node-fetch';
import * as utils from '../../utils';
import { SessionE } from '..';
export class UserClass extends BaseEntity {
	constructor() {
		super('User');
	}
	/**
	 * @function createToken
	 * @description function to create accessToken
	 * @payload  ProfileUpdate
	 * return object
	 */
	async createToken(payload, userData: UserRequest.UserData) {
		try {
			let sessionValid = {};
			if (userData.session) {
				sessionValid = {
					session: userData.session,
				};
			}
			const tokenData = {
				id: userData._id,
				tokenType: userData.type,
				timestamp: new Date().getTime(),
				session: userData.session,
			};

			const mergeData = { ...tokenData, ...sessionValid };
			const accessToken = await TokenManager.setToken(mergeData);
			return accessToken.accessToken;

		} catch (error) {
			return Promise.reject(error);
		}
	}

	async createPasswordResetToken(userData) {
		try {
			const tokenToSend = Jwt.sign(userData.email, pswdCert, { algorithm: 'HS256' });
			const expirationTime = new Date(new Date().getTime() + 10 * 60 * 1000);

			const criteriaForUpdatePswd = { _id: userData._id };
			const dataToUpdateForPswd = {
				passwordResetToken: tokenToSend,
				passwordResetTokenExpirationTime: expirationTime,
			};
			this.updateOneEntity(criteriaForUpdatePswd, dataToUpdateForPswd);
			return tokenToSend;
		} catch (error) {
			return Promise.reject(error);
		}
	}
	async getData(criteria, ProjectData) {
		try {
			const data = await this.DAOManager.findOne(this.modelName, criteria, ProjectData);
			return data;
		} catch (error) {
			Promise.reject(error);
		}
	}

	/**
	 * @description A Function to create token for after register api
	 */
	createRegisterToken(id: string | Types.ObjectId): string {
		return TokenManager.generateToken({ id });
	}
	/**
	 * @description A function to update the user with register second step data
	 * @param token A token to validate correct user request
	 * @param data A Data to update
	 */
	async completeRegisterProcess(token: string, data: object) {
		try {
			const { id } = await TokenManager.decodeToken(token) as { id: string };
			const doc = await this.DAOManager.findAndUpdate(this.modelName, {
				_id: new Types.ObjectId(id),
			}, data, { new: true });
			console.log('docdocdocdocdocdocdocdocdocdocdocdocdocdoc', doc);
			const salesforceData = flattenObject(doc.toObject ? doc.toObject() : doc);
			// console.log(doc, salesforceData);
			const request = {
				method: 'post',
				body: JSON.stringify(salesforceData),
			};
			const accessToken = await UserE.createToken({}, doc);
			console.log('accessTokenaccessTokenaccessToken', accessToken);

			await SessionE.createSession({}, doc, accessToken, 'user');

			const formatedData = utils.formatUserData(doc);
			// return { accessToken };

			await fetch(config.get('zapier_personUrl'), request);
			await fetch(config.get('zapier_accountUrl'), request);
			return { formatedData, accessToken };
		} catch (err) {
			console.log(err);
			// @TODO handle error messages for token and update failed
			return Promise.reject(err);
		}
	}
}

export const UserE = new UserClass();
