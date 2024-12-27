import { ipcMain } from 'electron';
import * as overlayHelper from '../window/overlayHelper';

const handleIpc = () => {
    ipcMain.handle('overlay/close', async () => {
        await overlayHelper.closeOverlayWindow();
    });
    ipcMain.handle('overlay/open', async () => {
        await overlayHelper.forceOpenNewOverlayWindow();
    });
    ipcMain.handle('overlay/increase-height', async (_event, height: number) => {
        overlayHelper.increaseOverlayHeightBy(height);
    });
}

export default handleIpc;
