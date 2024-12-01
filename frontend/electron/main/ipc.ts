import { ipcMain } from 'electron';
import * as notesService from './services/notes.service';
import * as windowManager from './windowManager';

export const handleIpc = () => {
    ipcMain.handle('add-note', async (_event, content: string) => {
        return notesService.addNote(content);
    });
    ipcMain.handle('close-overlay', async () => {
        windowManager.hideOverlayWindow();
        windowManager.resetOverlayWindow();
    });
}