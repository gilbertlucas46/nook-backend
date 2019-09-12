'use strict';

import * as HapiSwagger from 'hapi-swagger';
import * as Inert from 'inert';
import * as Vision from 'vision';

//Register Swagger Plugin
export let plugin = {
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
            // 'security': [{ 'api_Key': [] }]
        };
        await server.register([
            Inert,
            Vision,
            {
                plugin: HapiSwagger,
                options: swaggerOptions
            }
        ])
    }
};


