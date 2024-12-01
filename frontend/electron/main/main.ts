import { app, BrowserWindow, Tray, Menu, nativeImage, globalShortcut } from 'electron';
import path from 'path';
import started from 'electron-squirrel-startup';
import { handleIpc } from './ipc';
import * as windowManager from './windowManager';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
    app.quit();
}

const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
    app.quit();
}
let tray: Tray;

app.on('second-instance', (_event, argv, _workingDirectory) => {
    if (argv.includes('--overlay')) {
        windowManager.forceOpenNewOverlayWindow();
        return;
    }
    // Someone tried to run a second instance, we should focus our window
    windowManager.focusMainWindow();
});

app.whenReady()
    .then(() => {
        // Handle Icp
        handleIpc();

        // Tray icon
        const icon = nativeImage.createFromPath(path.join(__dirname, 'assets/icons/fast-notes-icon.png'));
        tray = new Tray(icon);
        tray.setToolTip('Fast Notes');

        const contextMenu = Menu.buildFromTemplate([
            { label: 'Open Dashboard', click: () => windowManager.showMainWindow() },
            { label: 'New Note', click: () => windowManager.forceOpenNewOverlayWindow() },
            { label: 'Quit', click: () => app.quit() },
        ]);
        tray.setContextMenu(contextMenu);
        tray.on('click', () => windowManager.forceOpenNewOverlayWindow());

        // Global shortcuts
        globalShortcut.register('Alt+CommandOrControl+N', () => windowManager.openOverlayWindow());
    })
    .then(() => {
        // Preload overlay window for faster opening later
        windowManager.createOverlayWindow();

        const args = process.argv.slice(1);
        if (args.includes('--overlay')) {
            windowManager.forceOpenNewOverlayWindow()
            return;
        }
        if (!args.includes('--hidden')) {
            windowManager.showMainWindow();
            app.on('activate', () => {
                if (BrowserWindow.getAllWindows().length === 0) windowManager.showMainWindow();
            });
        }
});

app.on('window-all-closed', () => {
    if (process.platform === 'darwin') app.dock.hide();
})