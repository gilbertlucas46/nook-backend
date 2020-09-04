// import { Server } from 'hapi';
// import { Routes } from './src/routes';
// import { plugins } from './src/plugins';
// import * as Bootstrap from './src/utils/bootstrap';
// import * as config from 'config';
// const path = require('path');

// // import * as Hsrc from "hapi";

// // import * as Constant from './src/constants';
// // import * as cron from 'node-cron';
// // import * as ENTITY from './src/entity';
// // import { ExpireServices, job1 } from './src/scheduler/propertyExpire';

// // let env = (process.env.NODE_ENV) ? process.env.NODE_ENV : 'default';

// const originArray: string[] = [
// 	'http://localhost:4200',
// 	'http://localhost:4201',
// 	'http://localhost',
// 	'https://nookdevangweb.appskeeper.com',
// 	'http://nookdevangadmin.appskeeper.com',
// 	'https://nookdevangadmin.appskeeper.com',

// 	'http://nookstgangweb.appskeeper.com',
// 	'https://nookstgangweb.appskeeper.com',
// 	'http://nookstgangadmin.appskeeper.com',
// 	'https://nookstgangadmin.appskeeper.com',

// 	'http://nookqaangweb.appskeeper.com',
// 	'https://nookqaangweb.appskeeper.com',
// 	'http://nookqaangadmin.appskeeper.com',
// 	'https://nookqaangadmin.appskeeper.com',
// 	'http://10.10.6.249:4200',
// 	'http://localhost:4200',
// 	'http://10.10.7.255:4200',
// 	'http://10.10.8.213:4200',
// 	// 'http://nookdev.appskeeper.com/documentation#!',
// ];

// const server = new Server({
// 	port: config.get('port'),
// 	routes: {
// 		cors: {
// 			origin: ['*'], // originArray,
// 			additionalHeaders: ['Accept', 'Access-Control-Allow-Origin', 'x-requested-with', 'Access-Control-Allow-Headers', 'api_key', 'Authorization', 'authorization', 'Content-Type', 'If-None-Match', 'platform'],
// 			exposedHeaders: ['Accept'],
// 			// maxAge: 60,
// 			credentials: true,
// 			headers: ['Authorization'],
// 		},
// 		files: {
// 			relativeTo: path.join(process.cwd(), '/views')
// 		},
// 	},
// });
// console.log('process.cwd()process.cwd()', process.cwd());

// const init = async () => {
// 	await server.register(plugins);
// 	Routes.push({
// 		method: 'GET',
// 		path: '/{param*}',
// 		options: {
// 			handler: {
// 				directory: {
// 					path: process.cwd() + '/src/views/',
// 					// listing: false,
// 				},
// 			},
// 		},
// 	});

// 	server.route(Routes);
// 	await server.start();
// 	const db = new Bootstrap.Bootstrap();
// 	await db.bootstrap();
// 	// ExpireServices.updateProperty();
// };

// init().then(_ => {
// 	console.log(`Server running at: ${config.get('port')}`);
// }).catch((err) => {
// 	console.warn('Error while loading plugins : ');
// 	console.error(err);
// 	process.exit(0);
// });

'use strict';
//Internal Dependencies
import * as Hsrc from 'hapi';
import { Routes } from './src/routes';
import { plugins } from './src/plugins';
import * as Constant from './src/constants';
import * as Bootstrap from './src/utils/bootstrap';
import * as config from 'config';
import { Server } from 'hapi';

const server = new Server({
	port: config.get('port'),
	routes: { cors: true },
});
console.log('process.cwd() process.cwd() ', process.cwd());

const init = async () => {
	await server.register(plugins);
	try {
		Routes.push(
			{
				method: 'GET',
				path: '/src/views/loan/'.toString() + `{path*}`,//'/views/uploads/image/{path*}',
				options: {
					handler: {
						directory: {
							path: process.cwd() + '/src/views/loan/'.toString(),
							listing: false,
						}
					},
				},
			},
			{
				method: 'GET',
				path: '/src/views/images/'.toString() + `{path*}`, // ' /views/uploads/image/{path*}',
				options: {
					handler: {
						directory: {
							path: process.cwd() + '/src/views/images/'.toString(),
							listing: false,
						},
					},
				},
			}
		)
		server.route(Routes);


		server.log('info', 'Plugins Loaded');
		await server.start();
		let db = new Bootstrap.Bootstrap();
		await db.bootstrap();

		console.log('Server running at:', 7362);
	} catch (err) {
		console.log('Error while loading plugins : ' + err);
	}
};

init();
