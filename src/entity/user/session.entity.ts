
import { BaseEntity } from '@src/entity/base/base.entity';
import * as mongoose from 'mongoose';
import { UserRequest } from '@src/interfaces/user.interface';
import * as utils from '@src/utils';
export class SessionClass extends BaseEntity {
	constructor() {
		super('Session');
	}
	// UserRequest.Session,
	async createSession(sessionData: any, userData, accessToken: string, type: string) {
		try {
			console.log('sourcesourcesourcesource', sessionData.source);
			let columnName: string;
			const sessionInfo = {
				_id: mongoose.Types.ObjectId().toString(),
				userId: userData._id,
				deviceId: sessionData.deviceId,
				validAttempt: accessToken ? true : false,
				// ipAddress: sessionData.ipAddress,
				source: sessionData.source,
				loginStatus: true,
				type,
				// deviceToken: sessionData.deviceToken,
			};
			// if (type === 'user') {
			// 	// columnName = 'userId';
			// 	sessionInfo[columnName] = userData._id;
			// }
			const session = await this.DAOManager.saveData(this.modelName, sessionInfo);
			if (session && session._id) { return session; }

		} catch (error) {
			return Promise.reject(error);
		}
	}
	async removeSession(criteria,dataToUpdate) {
		try {
			if(!criteria.deviceId){
				const condition={
					userId:criteria.userId
				}

				const session = await this.DAOManager.updateMany(this.modelName,condition,dataToUpdate,{});
				if (session && session._id) { return session; }	
			}
			
			const session = await this.DAOManager.findAndUpdate(this.modelName,criteria,dataToUpdate);
			
			if (session && session._id) { return session; }

		} catch (error) {
			utils.consolelog('error', error, true);
			return Promise.reject(error);
		}
	}
	async checkLoginSession(criteria) {
		try {
			console.log("................criteria............",criteria)
			const session = await this.DAOManager.findAll(this.modelName,criteria,{loginStatus:1});
			console.log("session..........",session)
			if (session ) { return session; }

		} catch (error) {
			utils.consolelog('error', error, true);
			return Promise.reject(error);
		}
	}
}

export let SessionE = new SessionClass();
