'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const HapiSwagger = require("hapi-swagger");
const Inert = require("inert");
const Vision = require("vision");
exports.plugin = {
    name: "swagger-plugin",
    register: async function (server) {
        const swaggerOptions = {
            info: {
                title: 'NOOK_APP API 1.0',
                version: 'v1',
            },
            "schemes": ["https"],
            'securityDefinitions': {
                'api_key': {
                    'type': 'apiKey',
                    'name': 'api_key',
                    'in': 'header'
                }
            },
        };
        await server.register([
            Inert,
            Vision,
            {
                plugin: HapiSwagger,
                options: swaggerOptions
            }
        ]);
    }
};
//# sourceMappingURL=swagger.js.map