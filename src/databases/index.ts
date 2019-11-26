import { connect, set, connection as db } from 'mongoose';
import * as config from 'config';
const dbUrl = config.get<string>('dbConfig.dbUrl');
const dbUserName = config.get<string>('dbConfig.dbUser');
const dbUserPwd = config.get<string>('dbConfig.dbPwd');
const displayColors = config.get('displayColors');
const environment = config.get<string>('environment');

export class Database {

	async connectDatabase() {
		set('debug', true);
		db.on('error', (err) => { console.error('%s', err); })
			.on('close', () => console.log('Database connection closed.'));
		switch (environment) {
			case 'development':
			case 'testing':
			case 'staging':
			case 'default': {
				connect(dbUrl, {
					auth: {
						user: dbUserName,
						password: dbUserPwd,
					},
					reconnectTries: 100000,
					reconnectInterval: 6000,
					useCreateIndex: true,
					useNewUrlParser: true,
				});
				break;
			}
		}
		console.info(displayColors ? '\x1b[32m%s\x1b[0m' : '%s', `Connected to ${dbUrl}`);
		return {};
	}
}
