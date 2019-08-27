import { connect, set, connection as db } from 'mongoose';
import * as config from 'config';
const dbUrl = config.get<string>('dbConfig.dbUrl');
const displayColors = config.get('displayColors');
const environment = config.get<string>('environment');

export class Database {
   async connectDatabase() {
     console.log('environment=====>>>',environment);
     
    set('debug', true);
   db.on('error', err => { console.error('%s', err) })
     .on('close', () => console.log('Database connection closed.'))
    switch (environment) {
      case "default": {
         console.log('connected to the db');        
        connect(dbUrl, { useCreateIndex: true, useNewUrlParser: true })
        break;
      }
      case "development": {
        connect(dbUrl, { useCreateIndex: true, useNewUrlParser: true })
        break
      }
      case "testing": {
        connect(dbUrl, { useCreateIndex: true, useNewUrlParser: true })
        break
      }
      case "staging": {
        connect(dbUrl, { w: "majority", journal: true, useCreateIndex: true, useNewUrlParser: true })
        break
     }
    }
    console.info(displayColors ? '\x1b[32m%s\x1b[0m' : '%s', `Connected to ${dbUrl}`)
    return {}
  }
  
}
