import { getLogsFolderPath } from '../utils/electronHelper';
import 'winston-daily-rotate-file';
import { createLogger, format, transports, config } from 'winston';

const logsFolder = getLogsFolderPath();

const customFormat = format.combine(
    format.errors({ stack: true }),
    format.json(),
);

const fileTransportAll = new transports.DailyRotateFile({
    level: process.env.NODE_ENV === 'development' ? 'info' : 'warning',
    filename: 'renderer-%DATE%.log',
    dirname: logsFolder,
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d',
});

const fileTransportError = new transports.DailyRotateFile({
    level: 'error',
    filename: 'renderer-%DATE%-errors.log',
    dirname: logsFolder,
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d',
});

const rendererLogger = createLogger({
    levels: config.syslog.levels,
    format: customFormat,
    transports: [
        fileTransportAll,
        fileTransportError,
    ],
    exitOnError: false,
});

export default rendererLogger;
