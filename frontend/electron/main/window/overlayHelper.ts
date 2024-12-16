import { createOverlayWindow, overlayWindow, setOverlayWindow } from './windowManager';

export const increaseOverlayHeightBy = (height: number) => {
    if (!overlayWindow) return;

    const bounds = overlayWindow.getBounds();
    const newHeight = Math.max(200, Math.min(500, bounds.height + height));
    overlayWindow.setBounds({
        ...bounds,
        height: newHeight
    });
}

export const forceOpenNewOverlayWindow = async () => {
    if (overlayWindow) {
        await closeOverlayWindow();
    }
    if (overlayWindow) overlayWindow.show();
}

export const openOverlayWindow = async () => {
    if (!overlayWindow) {
        await createOverlayWindow();
    }
    if (overlayWindow) overlayWindow.show();
}

export const closeOverlayWindow = async () => {
    if (!overlayWindow) return;

    overlayWindow.close();
    setOverlayWindow(null);
    await createOverlayWindow();
}

export const hideOverlayWindow = () => {
    if (!overlayWindow) return;

    overlayWindow.hide();
}