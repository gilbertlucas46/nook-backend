import { BaseEntity } from '@src/entity/base/base.entity';
import * as mongoose from 'mongoose';
import { AdminRequest } from '@src/interfaces/admin.interface';
import * as utils from '@src/utils';

export class AdminSessionClass extends BaseEntity {
	constructor() {
		super('AdminSession');
	}

	async createSession(sessionData: AdminRequest.Session) {
		try {
			const sessionInfo = {
				_id: mongoose.Types.ObjectId().toString(),
				adminId: sessionData.adminId,
				deviceId:sessionData.deviceId,
				// loginStatus: true,
				isLogin: true,
			};
       
			const session = await this.DAOManager.saveData(this.modelName, sessionInfo);
			if (session && session._id) { return session; }

		} catch (error) {
			utils.consolelog('error', error, true);
			return Promise.reject(error);
		}
	}
	async removeSession(criteria,dataToUpdate) {
		try {
			
			const session = await this.DAOManager.findAndUpdate(this.modelName,criteria,dataToUpdate);
			if (session && session._id) { return session; }

		} catch (error) {
			utils.consolelog('error', error, true);
			return Promise.reject(error);
		}
	}

}


export let AdminSessionE = new AdminSessionClass();
