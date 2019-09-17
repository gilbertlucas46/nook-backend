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
			case 'default': {
				connect(dbUrl, {
					auth: {
						user: dbUserName,
						password: dbUserPwd,
					},
					useCreateIndex: true,
					useNewUrlParser: true,
				});
				break;
			}
			case 'development': {
				connect(dbUrl, {
					auth: {
						user: dbUserName,
						password: dbUserPwd,
					},
					useCreateIndex: true,
					useNewUrlParser: true,
				});
				break;
			}
			case 'testing': {
				connect(dbUrl, {
					auth: {
						user: dbUserName,
						password: dbUserPwd,
					},
					useCreateIndex: true,
					useNewUrlParser: true,
				});
				break;
			}
			case 'staging': {
				connect(dbUrl, {
					auth: {
						user: dbUserName,
						password: dbUserPwd,
					},
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
