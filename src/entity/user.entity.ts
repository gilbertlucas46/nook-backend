import { BaseEntity } from './base.entity';
import * as config from 'config';
import * as TokenManager from '../lib';
import * as Jwt from 'jsonwebtoken';
const cert: any = config.get('jwtSecret');
export class UserClass extends BaseEntity {
	constructor() {
		super('User');
	}

	async createUser(userData: UserRequest.UserData) {
		try {
			const dataToInsert = {
				name: userData.userName,
				email: userData.email,
				// password:userData.password ,
				firstName: userData.firstName,
				lastName: userData.lastName,
				phoneNumber: userData.phoneNumber,
			};
			const user: UserRequest.Register = await this.createOneEntity(dataToInsert);
			return user;
		} catch (error) {
			return Promise.reject(error);
		}
	}

	async createToken(payload, userData: UserRequest.UserData) {
		try {
			let sessionValid = {};
			if (userData.session) {
				sessionValid = {
					session: userData.session,
				};
			}
			let tokenData;
			// if (!userData.type) {
			//     tokenData = {
			//         id: userData._id,
			//         deviceId: payload.deviceId,
			//         deviceToken: payload.deviceToken,
			//         tokenType: "TENANT",
			//         timestamp: new Date().getTime(),
			//         session: userData.session
			//     }
			// } else {
			tokenData = {
				id: userData._id,
				tokenType: userData.type,
				timestamp: new Date().getTime(),
				session: userData.session,
			};
			// }

			const mergeData = { ...tokenData, ...sessionValid };
			const accessToken: any = await TokenManager.setToken(mergeData);
			return accessToken.accessToken;

		} catch (error) {
			return Promise.reject(error);
		}
	}
	async createPasswordResetToken(userData) {
		try {
			const tokenToSend = await Jwt.sign(userData.email, cert, { algorithm: 'HS256' });
			const expirationTime = new Date(new Date().getTime() + 10 * 60 * 1000);

			const criteriaForUpdatePswd = { _id: userData._id };
			const dataToUpdateForPswd = {
				passwordResetToken: tokenToSend,
				passwordResetTokenExpirationTime: expirationTime,
			};
			await this.updateOneEntity(criteriaForUpdatePswd, dataToUpdateForPswd);
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
}

export const UserE = new UserClass();
