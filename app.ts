import { Server } from 'hapi';
import { Routes } from './src/routes';
import { plugins } from './src/plugins';
import * as Bootstrap from './src/utils/bootstrap';
import * as config from 'config';

// let env = (process.env.NODE_ENV) ? process.env.NODE_ENV : 'default';

const originArray: string[] = [
	'http://localhost:4200',
	'http://localhost:4201',
	'http://localhost',
	'http://nookdevangweb.appskeeper.com',
	'https://nookdevangweb.appskeeper.com',
	'http://nookdevangadmin.appskeeper.com',
	'https://nookdevangadmin.appskeeper.com',

	'http://nookstgangweb.appskeeper.com',
	'https://nookstgangweb.appskeeper.com',
	'http://nookstgangadmin.appskeeper.com',
	'https://nookstgangadmin.appskeeper.com',

	'http://nookqaangweb.appskeeper.com',
	'https://nookqaangweb.appskeeper.com',
	'http://nookqaangadmin.appskeeper.com',
	'https://nookqaangadmin.appskeeper.com',
];
const server = new Server({
	port: config.get('port'),
	routes: {
		cors: {
			origin: originArray,
			additionalHeaders: ['Accept', 'Access-Control-Allow-Origin', 'x-requested-with', 'Access-Control-Allow-Headers', 'api_key', 'Authorization', 'authorization', 'Content-Type', 'If-None-Match', 'platform'],
		},
	},
});

const init = async () => {
	await server.register(plugins);
	Routes.push({
		method: 'GET',
		path: '/{path*}',
		options: {
			handler: {
				directory: {
					path: process.cwd() + '/uploads/',
					listing: false,
				},
			},
		},
	});
	server.route(Routes);

	await server.start();
	const db = new Bootstrap.Bootstrap();
	await db.bootstrap();
};

init().then(() => {
	console.log(`Server running at: ${config.get('port')}`);
}).catch((err) => {
	console.warn('Error while loading plugins : ');
	console.error(err);
	process.exit(0);
});
