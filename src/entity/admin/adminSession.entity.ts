import { BaseEntity } from '../base.entity';
import * as mongoose from 'mongoose';

export class AdminSessionClass extends BaseEntity {
	constructor() {
		super('AdminSession');
	}

	async createSession(sessionData: AdminRequest.Session) {
		try {
			const sessionInfo = {
				_id: mongoose.Types.ObjectId().toString(),
				adminId: sessionData.adminId,
				isLogin: true,
				createdAt: new Date().getTime(),
				updatedAt: new Date().getTime(),
			};

			const session = await this.DAOManager.saveData(this.modelName, sessionInfo);
			if (session && session._id) { return session; }

		} catch (error) {
			return Promise.reject(error);
		}
	}
}

export let AdminSessionE = new AdminSessionClass();
