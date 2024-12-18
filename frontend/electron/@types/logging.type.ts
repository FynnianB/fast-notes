export type RendererLog = {
    level: LogLevel;
    message: string;
    context?: any;
    timestamp: string;
    uri: string;
}

export type LogLevel = 'emerg'|'alert'|'crit'|'error'|'warning'|'notice'|'info'|'debug';
