import * as good from 'good';

// Register Good
export let plugin = {
	name: 'good-plugin',
	async register(server) {
		const goodOptions = {
			ops: {
				interval: (30000000),
			},
			reporters: {
				console: [{
					module: 'good-console',
					args: [{ log: '*', response: '*' }],
				}, 'stdout'],
			},
		};
		await server.register({
			plugin: good,
			options: goodOptions,
		});
	},
};
