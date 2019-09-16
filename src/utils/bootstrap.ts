import { Database } from '../databases';
import { AdminE, regionEntity } from './../entity';
// const displayColors = config.get('displayColors');

export class Bootstrap {
	private dataBaseService = new Database();
	async bootstrap() {
		await this.dataBaseService.connectDatabase();
		await this.initRegions();
		AdminE.adminAccountCreator();
		// console.error(displayColors ? '\x1b[31m%s\x1b[0m' : '%s', error.toString())
	}
	async initRegions() {
		await regionEntity.bootstrap();
	}
}
