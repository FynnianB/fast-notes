/* eslint-disable no-console */
import type { LogLevel, RendererLog } from '../../../@types/logging.type';
import * as electronApi from '../api/electron.api';

const consoleFnBySyslogLevel = (level: LogLevel) => {
    switch (level) {
        case 'emerg':
        case 'alert':
        case 'crit':
        case 'error':
            return console.error;
        case 'warning':
            return console.warn;
        case 'notice':
        case 'info':
        case 'debug':
            return console.info;
        default:
            return console.log;
    }
};

const logger = {
    log: (level: LogLevel, message: string, context?: object): void => {
        const logEntry: RendererLog = {
            level,
            message,
            context,
            timestamp: new Date().toISOString(),
            uri: window.location.href,
        };

        if (process.env.NODE_ENV === 'development') {
            consoleFnBySyslogLevel(level)(`[${logEntry.level.toUpperCase()}] ${logEntry.message}`, logEntry.context);
        }

        if (
            process.env.NODE_ENV === 'production'
            && ['notice', 'info', 'debug'].includes(level)
        ) {
            return;
        }

        electronApi.log(logEntry).then();
    },

    emerg: (message: string, context?: object): void => logger.log('emerg', message, context),
    alert: (message: string, context?: object): void => logger.log('alert', message, context),
    crit: (message: string, context?: object): void => logger.log('crit', message, context),
    error: (message: string, context?: object): void => logger.log('error', message, context),
    warn: (message: string, context?: object): void => logger.log('warning', message, context),
    notice: (message: string, context?: object): void => logger.log('notice', message, context),
    info: (message: string, context?: object): void => logger.log('info', message, context),
    debug: (message: string, context?: object): void => logger.log('debug', message, context),
};

export default logger;
