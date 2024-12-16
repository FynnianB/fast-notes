import { createMainWindow, mainWindow, setMainWindowWindow } from './windowManager';

export const invokeMainWindowEvent = (channel: string, ...args: any[]) => {
    if (!mainWindow) return;
    mainWindow.webContents.send(channel, ...args);
};

export const showMainWindow = async () => {
    if (!mainWindow) {
        await createMainWindow();
    }
    if (!mainWindow) return;
    mainWindow.show();
}

export const focusMainWindow = async () => {
    if (!mainWindow) {
        await createMainWindow();
    }
    if (!mainWindow) return;
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.focus();
}

export const closeMainWindow = () => {
    if (!mainWindow) return;

    mainWindow.close();
    setMainWindowWindow(null);
}