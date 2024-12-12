import { ipcMain } from 'electron';
import { Note } from '../../@types/notes.type';
import { getNotes } from '../database/repository/notes.repository';
import { invokeMainWindowEvent } from '../windowManager';

const handleIpc = () => {
    ipcMain.handle('notes/fetch-all', async (_event): Promise<Note[]> => {
        return getNotes();
    });
}

export const invokeUpdateNotesEvent = (notes: Note[]) => {
    invokeMainWindowEvent('notes/update', notes);
}

export default handleIpc;