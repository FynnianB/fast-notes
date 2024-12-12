import { ipcMain } from 'electron';
import * as notesService from '../services/notes.service';
import * as windowManager from '../windowManager';

const handleIpc = () => {
    ipcMain.handle('overlay/add-note', async (_event, content: string) => {
        return notesService.addNote(content);
    });
    ipcMain.handle('overlay/close-overlay', async () => {
        windowManager.hideOverlayWindow();
        await windowManager.resetOverlayWindow();
    });
}

export default handleIpc;