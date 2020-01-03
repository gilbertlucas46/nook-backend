'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const good = require("good");
exports.plugin = {
    name: "good-plugin",
    register: async function (server) {
        const goodOptions = {
            ops: {
                interval: (30000000)
            },
            reporters: {
                console: [{
                        module: 'good-console',
                        args: [{ log: '*', response: '*', }]
                    }, 'stdout']
            }
        };
        await server.register({
            plugin: good,
            options: goodOptions,
        });
    }
};
//# sourceMappingURL=good.js.map