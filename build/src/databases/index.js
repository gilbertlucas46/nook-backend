"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const config = require("config");
const dbUrl = config.get('dbConfig.dbUrl');
const dbUserName = config.get('dbConfig.dbUser');
const dbUserPwd = config.get('dbConfig.dbPwd');
const displayColors = config.get('displayColors');
const environment = config.get('environment');
class Database {
    async connectDatabase() {
        mongoose_1.set('debug', true);
        mongoose_1.connection.on('error', err => { console.error('%s', err); })
            .on('close', () => console.log('Database connection closed.'));
        switch (environment) {
            case "default": {
                mongoose_1.connect(dbUrl, {
                    auth: {
                        user: dbUserName,
                        password: dbUserPwd,
                    },
                    useCreateIndex: true,
                    useNewUrlParser: true
                });
                break;
            }
            case "development": {
                mongoose_1.connect(dbUrl, {
                    auth: {
                        user: dbUserName,
                        password: dbUserPwd,
                    },
                    useCreateIndex: true,
                    useNewUrlParser: true
                });
                break;
            }
            case "testing": {
                mongoose_1.connect(dbUrl, {
                    auth: {
                        user: dbUserName,
                        password: dbUserPwd,
                    },
                    useCreateIndex: true,
                    useNewUrlParser: true
                });
                break;
            }
            case "staging": {
                mongoose_1.connect(dbUrl, {
                    auth: {
                        user: dbUserName,
                        password: dbUserPwd,
                    },
                    useCreateIndex: true,
                    useNewUrlParser: true
                });
                break;
            }
        }
        console.info(displayColors ? '\x1b[32m%s\x1b[0m' : '%s', `Connected to ${dbUrl}`);
        return {};
    }
}
exports.Database = Database;
//# sourceMappingURL=index.js.map