import { Server } from 'hapi';
import { Routes } from './src/routes';
import { plugins } from './src/plugins';
import * as Bootstrap from './src/utils/bootstrap';
import * as config from 'config';
// import * as Constant from './src/constants';
// import * as cron from 'node-cron';
// import * as ENTITY from './src/entity';
// import { ExpireServices, job1 } from './src/scheduler/propertyExpire';

// let env = (process.env.NODE_ENV) ? process.env.NODE_ENV : 'default';

const originArray: string[] = [
	'http://localhost:4200',
	'http://localhost:4201',
	'http://localhost',
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
	'http://10.10.6.249:4200',
	'http://localhost:4200',
	'http://10.10.7.255:4200',
	'http://10.10.8.213:4200',
	'https://nookdev.appskeeper.com/documentation#!',
];


const server = new Server({
	port: config.get('port'),
	routes: {
		cors: {
			origin: ['*'], // originArray,
			additionalHeaders: ['Accept', 'Access-Control-Allow-Origin', 'x-requested-with', 'Access-Control-Allow-Headers', 'api_key', 'Authorization', 'authorization', 'Content-Type', 'If-None-Match', 'platform'],
			exposedHeaders: ['Accept'],
			// maxAge: 60,
			credentials: true,
			headers: ['Authorization'],
		},
	},
});

const init = async () => {
	await server.register(plugins);
	Routes.push({
		method: 'GET',
		path: '/images/{path*}',
		options: {
			handler: {
				directory: {
					path: process.cwd() + '/src/views/images/',
					listing: false,
				},
			},
		},
	});

	server.route(Routes);
	await server.start();
	const db = new Bootstrap.Bootstrap();
	await db.bootstrap();
	// ExpireServices.updateProperty();
};

init().then(_ => {
	console.log(`Server running at: ${config.get('port')}`);
}).catch((err) => {
	console.warn('Error while loading plugins : ');
	console.error(err);
	process.exit(0);
});
