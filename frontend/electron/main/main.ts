import { app, Tray, Menu, nativeImage, globalShortcut } from 'electron';
import installExtension, { REDUX_DEVTOOLS, REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer';
import path from 'path';
import started from 'electron-squirrel-startup';
import * as mainWindowHelper from './window/mainWindowHelper';
import * as overlayHelper from './window/overlayHelper';
import * as windowManager from './window/windowManager';
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
        await overlayHelper.forceOpenNewOverlayWindow();
        return;
    }
    // Someone tried to run a second instance, we should focus our window
    await mainWindowHelper.focusMainWindow();
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
            { label: 'Open Dashboard', click: () => mainWindowHelper.showMainWindow() },
            { label: 'New Note', click: () => overlayHelper.openOverlayWindow() },
            { label: 'Quit', click: () => app.quit() },
        ]);
        tray.setContextMenu(contextMenu);
        tray.on('click', () => overlayHelper.openOverlayWindow());

        // Global shortcuts
        globalShortcut.register('Alt+CommandOrControl+N', () => overlayHelper.openOverlayWindow());
    })
    .then(async () => {
        // Preload overlay window for faster opening later
        await windowManager.createOverlayWindow();

        const args = process.argv.slice(1);
        if (args.includes('--overlay')) {
            await overlayHelper.forceOpenNewOverlayWindow()
            return;
        }
        if (!args.includes('--hidden')) {
            // await mainWindowHelper.showMainWindow();
            // app.on('activate', () => {
            //     if (BrowserWindow.getAllWindows().length === 0) mainWindowHelper.showMainWindow();
            // });
        }
});

app.on('window-all-closed', () => {
    if (process.platform === 'darwin') app.dock.hide();
})