import { Database } from '../databases';
import { AdminE, regionEntity } from '@src/entity';
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
}
