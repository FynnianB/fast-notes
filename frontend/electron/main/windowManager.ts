import { BrowserWindow } from 'electron';
import path from 'path';
import windowStateKeeper from 'electron-window-state';

declare const REACT_RENDERER_VITE_DEV_SERVER_URL: string;
declare const REACT_RENDERER_VITE_NAME: string;

let mainWindow: BrowserWindow|null = null;
let overlayWindow: BrowserWindow|null = null;

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
        overlayWindow.loadURL(REACT_RENDERER_VITE_DEV_SERVER_URL + '/overlay').then(_ => {});
    } else {
        overlayWindow.loadFile(path.join(__dirname, `../renderer/${REACT_RENDERER_VITE_NAME}/overlay.html`)).then(_ => {});
    }

    overlayWindow.webContents.on('before-input-event', (event, input) => {
        if (input.key === 'Escape') {
            hideOverlayWindow();
            event.preventDefault();
        }
    });
};

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

const forceOpenNewOverlayWindow = () => {
    if (overlayWindow) {
        resetOverlayWindow();
    }
    if (overlayWindow) overlayWindow.show();
}

const openOverlayWindow = () => {
    if (!overlayWindow) {
        createOverlayWindow();
    }
    if (overlayWindow) overlayWindow.show();
}

const resetOverlayWindow = () => {
    if (!overlayWindow) return;

    overlayWindow.close();
    overlayWindow = null;
    createOverlayWindow();
}

const hideOverlayWindow = () => {
    if (!overlayWindow) return;

    overlayWindow.hide();
}

const showMainWindow = () => {
    if (!mainWindow) createMainWindow();
    if (!mainWindow) return;

    mainWindow.show();
}

const focusMainWindow = () => {
    if (!mainWindow) createMainWindow();
    if (!mainWindow) return;

    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.focus();
}

const closeMainWindow = () => {
    if (!mainWindow) return;

    mainWindow.close();
}

export {
    forceOpenNewOverlayWindow,
    createOverlayWindow,
    openOverlayWindow,
    resetOverlayWindow,
    hideOverlayWindow,
    showMainWindow,
    focusMainWindow,
    closeMainWindow,
}