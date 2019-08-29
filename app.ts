//"mongodb://uchatdev_usr:bN9XMhccGvS9WwSh@uchatdev.appskeeper.com:27200/uchatdev_db"

"use strict";
//Internal Dependencies
import * as Hsrc from "hapi";
import { Routes } from "./src/routes";
import { plugins } from "./src/plugins";
import * as Bootstrap from "./src/utils/bootstrap";
import * as config from 'config'

let env = (process.env.NODE_ENV) ? process.env.NODE_ENV : 'default';

const server = Hsrc.server({
  port: config.get('port'),
  // routes: { cors: true },
  routes: {
    cors: {
      origin: ['*'], // an array of origins or 'ignore'
      headers: ['Authorization'], // an array of strings - 'Access-Control-Allow-Headers' 
      exposedHeaders: ['Accept'], // an array of exposed headers - 'Access-Control-Expose-Headers',
      additionalExposedHeaders: ['Accept'], // an array of additional exposed headers
      maxAge: 60,
      credentials: true // boolean - 'Access-Control-Allow-Credentials'
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
