import { BaseEntity } from '@src/entity/base/base.entity';
import * as mongoose from 'mongoose';
import { AdminRequest } from '@src/interfaces/admin.interface';

export class AdminSessionClass extends BaseEntity {
	constructor() {
		super('AdminSession');
	}

	async createSession(sessionData: AdminRequest.Session) {
		try {
			const sessionInfo = {
				_id: mongoose.Types.ObjectId().toString(),
				adminId: sessionData.adminId,
				// loginStatus: true,
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
