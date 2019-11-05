import { Database } from '../databases';
import { AdminE, regionEntity } from '@src/entity';
import { LoanApplication } from '@src/models';
export class Bootstrap {
	private dataBaseService = new Database();
	async bootstrap() {
		await this.dataBaseService.connectDatabase();
		await this.initRegions();
		AdminE.adminAccountCreator();
	}
	async initRegions() {
		await regionEntity.bootstrap();
	}

	async bootstrapCounters() {
		const lastUser: any = await LoanApplication.findOne({}).sort({ uniqueId: -1 }).select({ uniqueId: 1, _id: 0 }).exec();
		let userCounter = 0;
		if (lastUser) {
			const userId = lastUser.referenceId || 'USR0';
			// console.log('userIduserId', userId);
			userCounter = parseInt(userId.substr(3), 10);
			// console.log('userCounteruserCounteruserCounter', userCounter);
		}
		// global.counters = {
		// 	LoanApplication: userCounter,
		// };
	}
}
