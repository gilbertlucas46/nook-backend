import { Database } from '../databases';
import { AdminE, regionEntity } from '@src/entity';
import { LoanApplication } from '@src/models';
import { Transaction } from '@src/models';

export class Bootstrap {
	private dataBaseService = new Database();
	async bootstrap() {
		await this.dataBaseService.connectDatabase();
		await this.initRegions();
		AdminE.adminAccountCreator();
		await this.initCounters();
	}
	async initRegions() {
		await regionEntity.bootstrap();
	}

	async bootstrapCounters() {
		const lastUser: any = await LoanApplication.findOne({}).sort({ uniqueId: -1 }).select({ uniqueId: 1, _id: 0 }).exec();
		console.log('lastUserlastUser', lastUser);

		let userCounter = 0;
		if (lastUser) {
			const userId = lastUser.referenceId || 'USR0';
			console.log('userIduserIduserIduserId', userId);
			userCounter = parseInt(userId.substr(3), 10);
			console.log('userCounteruserCounteruserCounter', userCounter);

		}
		global.counters = {
			LoanApplication: userCounter,
		};
	}

	async initCounters() {
		const lastTransaction = await Transaction.findOne({}).sort({ createdAt: -1 }).select({ invoiceNo: 1, _id: 0 }).exec();
		let transactionCounter = 0;
		if (lastTransaction) {
			const invoiceNo = lastTransaction['invoiceNo'] || 'INV' + new Date().getFullYear();
			transactionCounter = parseInt(invoiceNo.substr(7));
		}
		global.counters = {
			Transaction: transactionCounter,
		};
	}
}
