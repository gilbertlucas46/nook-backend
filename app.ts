//"mongodb://uchatdev_usr:bN9XMhccGvS9WwSh@uchatdev.appskeeper.com:27200/uchatdev_db"

"use strict";
//Internal Dependencies
import * as Hsrc from "hapi";
import { Routes } from "./src/routes";
import { plugins } from "./src/plugins";
import * as Bootstrap from "./src/utils/bootstrap";
import * as config from 'config'

let env = (process.env.NODE_ENV) ? process.env.NODE_ENV : 'default';

let originArray = ['http://localhost:4200', 'http://localhost:4201', 'http://localhost','https://nookdevang.appskeeper.com','http://nookdevang.appskeeper.com'];

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
  await server.register(plugins);
  try {
    Routes.push(
      {
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
      })
    server.route(Routes);

    await server.start();
    let db = new Bootstrap.Bootstrap();
    await db.bootstrap(server);
    console.log("Server running at:", config.get('port'));
  } catch (err) {
    console.log("Error while loading plugins : " + err);
  }
};

init();
