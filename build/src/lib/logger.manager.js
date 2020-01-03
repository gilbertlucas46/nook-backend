"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = require("winston");
const appRoot = process.cwd();
const levels = {
    DB_ERROR: 0,
    error: 1,
    warn: 2,
    info: 3,
    debug: 4,
    verbose: 5
};
var options = {
    dbfile: {
        level: 'DB_ERROR',
        filename: `${appRoot}/logs/db.log`,
        handleExceptions: true,
        json: true,
        colorize: false,
    },
    infofile: {
        level: 'info',
        filename: `${appRoot}/logs/infofile.log`,
        handleExceptions: true,
        json: true,
        colorize: false,
    },
    console: {
        level: 'debug',
        handleExceptions: true,
        format: winston_1.format.combine(winston_1.format.colorize(), winston_1.format.simple())
    },
};
exports.logger = winston_1.createLogger({
    levels: levels,
    transports: [
        new winston_1.transports.Console(options.console),
        new winston_1.transports.File(options.dbfile),
        new winston_1.transports.File(options.infofile),
    ],
    exitOnError: false
});
//# sourceMappingURL=logger.manager.js.map