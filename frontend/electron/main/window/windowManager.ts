import { BrowserWindow, nativeImage } from 'electron';
import path from 'path';
import windowStateKeeper from 'electron-window-state';
import * as overlayHelper from './overlayHelper';

declare const REACT_RENDERER_VITE_DEV_SERVER_URL: string;
declare const REACT_RENDERER_VITE_NAME: string;

export let mainWindow: BrowserWindow|null = null;
export let overlayWindow: BrowserWindow|null = null;

export const createOverlayWindow = async () => {
    overlayWindow = new BrowserWindow({
        width: 500,
        minHeight: 200,
        maxHeight: 500,
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
        transparent: true,
    });

    if (REACT_RENDERER_VITE_DEV_SERVER_URL) {
        await overlayWindow.loadURL(REACT_RENDERER_VITE_DEV_SERVER_URL + '/overlay');
    } else {
        await overlayWindow.loadFile(path.join(__dirname, `../renderer/${REACT_RENDERER_VITE_NAME}/overlay.html`));
    }

    overlayWindow.webContents.on('before-input-event', (event, input) => {
        if (input.key === 'Escape') {
            event.preventDefault();
            overlayHelper.closeOverlayWindow();
        } else if (input.key === 'M' && input.control) {
            event.preventDefault();
            overlayHelper.hideOverlayWindow();
        }
    });
};

export const createMainWindow = async () => {
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
            color: '#212225',
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
    });

    mainWindowState.manage(mainWindow);
};

export const setOverlayWindow = (window: BrowserWindow|null) => overlayWindow = window;
export const setMainWindowWindow = (window: BrowserWindow|null) => mainWindow = window;
