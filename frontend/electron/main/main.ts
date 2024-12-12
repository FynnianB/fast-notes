import { app, BrowserWindow, Tray, Menu, nativeImage, globalShortcut } from 'electron';
import installExtension, { REDUX_DEVTOOLS, REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer';
import path from 'path';
import started from 'electron-squirrel-startup';
import * as windowManager from './windowManager';
import { handleIpc } from './ipc';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
    app.quit();
}

const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
    app.quit();
}

let tray: Tray;

app.on('second-instance', async (_event, argv, _workingDirectory) => {
    if (argv.includes('--overlay')) {
        await windowManager.forceOpenNewOverlayWindow();
        return;
    }
    // Someone tried to run a second instance, we should focus our window
    await windowManager.focusMainWindow();
});
app.whenReady()
    .then(async () => {
        // Install dev tools extensions
        if (process.env.NODE_ENV === 'development') {
            try {
                const installedExtensions = await installExtension([REDUX_DEVTOOLS, REACT_DEVELOPER_TOOLS]);
                console.log('Installed Extensions: ', installedExtensions);
            } catch (e) {
                console.error('Failed to install extensions: ', e);
            }
        }

        // Setup Ipc handlers
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
    .then(async () => {
        // Preload overlay window for faster opening later
        await windowManager.createOverlayWindow();

        const args = process.argv.slice(1);
        if (args.includes('--overlay')) {
            await windowManager.forceOpenNewOverlayWindow()
            return;
        }
        if (!args.includes('--hidden')) {
            await windowManager.showMainWindow();
            app.on('activate', () => {
                if (BrowserWindow.getAllWindows().length === 0) windowManager.showMainWindow();
            });
        }
});

app.on('window-all-closed', () => {
    if (process.platform === 'darwin') app.dock.hide();
})