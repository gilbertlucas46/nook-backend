"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Hsrc = require("hapi");
const routes_1 = require("./src/routes");
const plugins_1 = require("./src/plugins");
const Bootstrap = require("./src/utils/bootstrap");
const config = require("config");
let env = (process.env.NODE_ENV) ? process.env.NODE_ENV : 'default';
let originArray = ['http://localhost:4200', 'http://localhost:4201', 'http://localhost', 'https://nookdevang.appskeeper.com', 'http://nookdevang.appskeeper.com', 'https://nookqaang.appskeeper.com', 'http://nookqaang.appskeeper.com', 'https://nookstgang.appskeeper.com', 'http://nookstgang.appskeeper.com', 'https://nookdev.appskeeper.com', 'http://nookdev.appskeeper.com'];
const server = Hsrc.server({
    port: config.get('port'),
    routes: {
        cors: {
            origin: originArray,
            additionalHeaders: ['Accept', 'Access-Control-Allow-Origin', 'x-requested-with', 'Access-Control-Allow-Headers', 'api_key', 'Authorization', 'authorization', 'Content-Type', 'If-None-Match', 'platform']
        }
    }
});
const init = async () => {
    await server.register(plugins_1.plugins);
    try {
        routes_1.Routes.push({
            method: 'GET',
            path: '/{path*}',
            options: {
                handler: {
                    directory: {
                        path: process.cwd() + '/uploads/',
                        listing: false,
                    }
                }
            }
        });
        server.route(routes_1.Routes);
        await server.start();
        let db = new Bootstrap.Bootstrap();
        await db.bootstrap(server);
        console.log("Server running at:", config.get('port'));
    }
    catch (err) {
        console.log("Error while loading plugins : " + err);
    }
};
init();
//# sourceMappingURL=app.js.map