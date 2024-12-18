import { app } from 'electron';
import fs from 'fs';

export const getLogsFolderPath = (): string => {
    const logsFolder = app.getPath('logs');

    if (!fs.existsSync(logsFolder)) {
        fs.mkdirSync(logsFolder, { recursive: true });
    }

    return logsFolder;
}
