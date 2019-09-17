import { ServerRoute, Request, ResponseToolkit } from 'hapi';
import { contentController } from '@src/controllers/content/content.controller';
import * as UniversalFunctions from '@src/utils';

export const contentRoutes: ServerRoute[] = [
	{
		method: 'GET',
		path: '/v1/content/regions',
		async handler(req: Request, h: ResponseToolkit) {
			const result = await contentController.regionsList();
			return UniversalFunctions.sendSuccess('Successfully', result);
		},
	},
];
