import { getLogsFolderPath } from '../utils/electronHelper';
import 'winston-daily-rotate-file';
import { config, createLogger, format, transports } from 'winston';

const isDev = process.env.NODE_ENV === 'development';

const logsFolder = getLogsFolderPath();

const fileFormat = format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.metadata({ key: 'context', fillExcept: ['level', 'message', 'timestamp'] }),
    format.json(),
);

const consoleFormat = format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.errors({ stack: true }),
    format.metadata({ key: 'context', fillExcept: ['level', 'message', 'timestamp'] }),
    format.cli({ all: true }),
    format.simple(),
);

const fileTransportAll = new transports.DailyRotateFile({
    format: fileFormat,
    filename: 'main-%DATE%.log',
    dirname: logsFolder,
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d',
});

const fileTransportError = new transports.DailyRotateFile({
    format: fileFormat,
    level: 'error',
    filename: 'main-%DATE%-errors.log',
    dirname: logsFolder,
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d',
});

const consoleTransport = new transports.Console({
    format: consoleFormat,
});

const logger = createLogger({
    level: isDev ? 'debug' : 'warning',
    levels: config.syslog.levels,
    transports: [
        fileTransportAll,
        fileTransportError,
        ...(isDev ? [consoleTransport] : []),
    ],
    exceptionHandlers: [
        fileTransportAll,
        fileTransportError,
        ...(isDev ? [consoleTransport] : []),
    ],
    rejectionHandlers: [
        fileTransportAll,
        fileTransportError,
        ...(isDev ? [consoleTransport] : []),
    ],
});

export default logger;
