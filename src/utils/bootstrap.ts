import { Database } from '../databases';
import { AdminE, regionEntity, ArticleCategoryE } from '@src/entity';
import { LoanApplication } from '@src/models';

export class Bootstrap {
	private dataBaseService = new Database();
	async bootstrap() {
		await this.dataBaseService.connectDatabase();
		await this.initRegions();
		AdminE.adminAccountCreator();
		const serverTime = new Date();
		console.log('serverTimeserverTimeserverTime', serverTime);
		const getTime = new Date().getTime();
		console.log('TimeStampTimeStampTimeStampTimeStamp', getTime);


		// await this.initCounters();
		// await this.subscriptionPlan();
		// await this.bootstrapCounters();
		// ArticleCategoryE.addSellingArticle();
	}
	async initRegions() {
		await regionEntity.bootstrap();
	}

	async bootstrapCounters() {
		const criteria1 = ({
			createdAt: {
				$gte: new Date(new Date(new Date().setHours(0)).setMinutes(0)).setMilliseconds(0),
			},
		});

		const lastUser: any = await LoanApplication.findOne(criteria1).sort({ uniqueId: -1 }).select({ uniqueId: 1, _id: 0 }).exec();
		console.log('lastUserlastUserlastUserlastUser', lastUser);
		let userCounter = 0;
		if (lastUser) {
			const userId = lastUser.referenceId || 'USR0';
			userCounter = parseInt(userId.substr(3), 10);
		}
		// global.counters = {
		// 	LoanApplication: userCounter,
		// };
	}

	// async initCounters() {
	// 	const lastTransaction = await Transaction.findOne({}).sort({ createdAt: -1 }).select({ invoiceNo: 1, _id: 0 }).exec();
	// 	let transactionCounter = 0;
	// 	if (lastTransaction) {
	// 		const invoiceNo = lastTransaction['invoiceNo'] || 'INV' + new Date().getFullYear();
	// 		transactionCounter = parseInt(invoiceNo.substr(7));
	// 	}
	// 	const lastProperty = await Property.findOne({}).sort({ propertyId: -1 }).select({ propertyId: 1, _id: 0 }).exec();
	// 	let propertyCounter = 0;
	// 	if (lastProperty['propertyId']) {
	// 		propertyCounter = lastProperty['propertyId'] || 0;
	// 	}

	// 	global.counters = {
	// 		Transaction: transactionCounter,
	// 		Property: propertyCounter,
	// 	};
	// }

	// async subscriptionPlan() {
	// 	await SubscriptionPlanEntity.bootstrap();
	// }
}