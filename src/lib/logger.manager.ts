import { createLogger, format, transports } from 'winston';

const appRoot = process.cwd();
const levels = {
	DB_ERROR: 0,
	error: 1,
	warn: 2,
	info: 3,
	debug: 4,
	verbose: 5,
};

const options = {
	dbfile: {
		level: 'DB_ERROR',
		filename: `${appRoot}/logs/db.log`,
		handleExceptions: true,
		json: true,
		// maxsize: 5242880, // 5MB
		// maxFiles: 5,
		colorize: false,
	},
	infofile: {
		level: 'info',
		filename: `${appRoot}/logs/infofile.log`,
		handleExceptions: true,
		json: true,
		// maxsize: 5242880, // 5MB
		// maxFiles: 5,
		colorize: false,
	},
	console: {
		level: 'debug',
		handleExceptions: true,
		format: format.combine(
			format.colorize(),
			format.simple()),
	},
};

export const logger = createLogger({
	levels,
	transports: [
		new transports.Console(options.console),
		new transports.File(options.dbfile),
		new transports.File(options.infofile),
	],
	exitOnError: false,
});
