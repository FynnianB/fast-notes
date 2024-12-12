import { BrowserWindow, nativeImage } from 'electron';
import path from 'path';
import windowStateKeeper from 'electron-window-state';

declare const REACT_RENDERER_VITE_DEV_SERVER_URL: string;
declare const REACT_RENDERER_VITE_NAME: string;

let mainWindow: BrowserWindow|null = null;
let overlayWindow: BrowserWindow|null = null;

const createOverlayWindow = async () => {
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
        await overlayWindow.loadURL(REACT_RENDERER_VITE_DEV_SERVER_URL + '/overlay');
    } else {
        await overlayWindow.loadFile(path.join(__dirname, `../renderer/${REACT_RENDERER_VITE_NAME}/overlay.html`));
    }

    overlayWindow.webContents.on('before-input-event', (event, input) => {
        if (input.key === 'Escape') {
            event.preventDefault();
            hideOverlayWindow();
        }
    });
};

const createMainWindow = async () => {
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
        titleBarOverlay: {
            color: '#222',
            symbolColor: '#686868',
            height: 36,
        },
        darkTheme: true,
        backgroundColor: '#111113',
        icon: nativeImage.createFromPath(path.join(__dirname, '/assets/icons/fast-notes-icon.ico'))
    });

    if (REACT_RENDERER_VITE_DEV_SERVER_URL) {
        await mainWindow.loadURL(REACT_RENDERER_VITE_DEV_SERVER_URL + '/main_window');
    } else {
        await mainWindow.loadFile(path.join(__dirname, `../renderer/${REACT_RENDERER_VITE_NAME}/main_window.html`));
    }
    mainWindow.on('closed', function () {
        mainWindow = null
    })

    // Open DevTools
    if (process.env.NODE_ENV === 'development') {
        mainWindow.webContents.openDevTools();
    }

    mainWindowState.manage(mainWindow);
};

const invokeMainWindowEvent = (channel: string, ...args: any[]) => {
    if (!mainWindow) return;
    mainWindow.webContents.send(channel, ...args);
};

const forceOpenNewOverlayWindow = async () => {
    if (overlayWindow) {
        await resetOverlayWindow();
    }
    if (overlayWindow) overlayWindow.show();
}

const openOverlayWindow = async () => {
    if (!overlayWindow) {
        await createOverlayWindow();
    }
    if (overlayWindow) overlayWindow.show();
}

const resetOverlayWindow = async () => {
    if (!overlayWindow) return;

    overlayWindow.close();
    overlayWindow = null;
    await createOverlayWindow();
}

const hideOverlayWindow = () => {
    if (!overlayWindow) return;

    overlayWindow.hide();
}

const showMainWindow = async () => {
    if (!mainWindow) {
        await createMainWindow();
    }
    if (!mainWindow) return;
    mainWindow.show();
}

const focusMainWindow = async () => {
    if (!mainWindow) {
        await createMainWindow();
    }
    if (!mainWindow) return;
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.focus();
}

const closeMainWindow = () => {
    if (!mainWindow) return;

    mainWindow.close();
    mainWindow = null;
}

export {
    invokeMainWindowEvent,
    forceOpenNewOverlayWindow,
    createOverlayWindow,
    openOverlayWindow,
    resetOverlayWindow,
    hideOverlayWindow,
    showMainWindow,
    focusMainWindow,
    closeMainWindow,
}