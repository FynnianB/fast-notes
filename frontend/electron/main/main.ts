import { app, BrowserWindow, Tray, Menu, nativeImage, globalShortcut } from 'electron';
import path from 'path';
// @ts-expect-error
import started from 'electron-squirrel-startup';
import windowStateKeeper from 'electron-window-state';

declare const REACT_RENDERER_VITE_DEV_SERVER_URL: string;
declare const REACT_RENDERER_VITE_NAME: string;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
    app.quit();
}

const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
    app.quit();
}

let mainWindow: BrowserWindow|null = null;
let overlayWindow: BrowserWindow;
let tray: Tray;

const createOverlayWindow = () => {
    overlayWindow = new BrowserWindow({
        width: 400,
        height: 300,
        webPreferences: {
            preload: path.join(__dirname, 'overlay.preload.js'),
        },
        frame: false,
        show: false,
        alwaysOnTop: true,
        center: true,
        minimizable: false,
        maximizable: false,
        movable: false,
        fullscreenable: false,
        fullscreen: false,
        skipTaskbar: true,
        darkTheme: true,
    });

    if (REACT_RENDERER_VITE_DEV_SERVER_URL) {
        overlayWindow.loadURL(REACT_RENDERER_VITE_DEV_SERVER_URL + '/overlay');
    } else {
        overlayWindow.loadFile(path.join(__dirname, `../renderer/${REACT_RENDERER_VITE_NAME}/overlay.html`));
    }

    overlayWindow.webContents.on('before-input-event', (event, input) => {
        if (input.key === 'Escape') {
            overlayWindow.hide();
            event.preventDefault();
        }
    });
}

const createMainWindow = () => {
    let mainWindowState = windowStateKeeper({
        defaultWidth: 1000,
        defaultHeight: 800
    });

    mainWindow = new BrowserWindow({
        x: mainWindowState.x,
        y: mainWindowState.y,
        width: mainWindowState.width,
        height: mainWindowState.height,
        webPreferences: {
            preload: path.join(__dirname, 'main-window.preload.js'),
        },
        titleBarStyle: 'hidden',
        titleBarOverlay: true,
        darkTheme: true,
    });

    if (REACT_RENDERER_VITE_DEV_SERVER_URL) {
        mainWindow.loadURL(REACT_RENDERER_VITE_DEV_SERVER_URL + '/main_window');
    } else {
        mainWindow.loadFile(path.join(__dirname, `../renderer/${REACT_RENDERER_VITE_NAME}/main_window.html`));
    }
    mainWindow.on('closed', function () {
        mainWindow = null
    })

    mainWindowState.manage(mainWindow);
};

app.on('second-instance', (event, argv, workingDirectory) => {
    if (argv.includes('--overlay')) {
        overlayWindow.show();
        return;
    }
    // Someone tried to run a second instance, we should focus our window
    if (mainWindow) {
        if (mainWindow.isMinimized()) mainWindow.restore();
        mainWindow.focus();
    }
});

app.whenReady()
    .then(() => {
        // Tray icon
        const icon = nativeImage.createFromPath(path.join(__dirname, '/assets/images/fast-notes-icon.jpeg'));
        tray = new Tray(icon);
        tray.setToolTip('Fast Notes');

        const contextMenu = Menu.buildFromTemplate([
            { label: 'Open Dashboard', click: () => mainWindow === null ? createMainWindow() : mainWindow.show() },
            { label: 'New Note', click: () => overlayWindow.show() },
            { label: 'Quit', click: () => app.quit() },
        ]);
        tray.setContextMenu(contextMenu);
        tray.on('click', () => overlayWindow.show());

        // Global shortcuts
        globalShortcut.register('Alt+CommandOrControl+N', () => overlayWindow.show());
    })
    .then(() => {
        createOverlayWindow();

        const args = process.argv.slice(1); // Skip the first argument (node path)
        if (args.includes('--overlay')) {
            overlayWindow.show();
            return;
        }
        if (args.includes('--hidden')) {
            return;
        }

        createMainWindow();
        app.on('activate', () => {
            if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
        });
});

app.on('window-all-closed', () => {
    if (process.platform === 'darwin') app.dock.hide();
})