import { ipcMain } from 'electron';
import { Note } from '../../@types/notes.type';
import { getNotes, updateNote } from '../database/repository/notes.repository';
import { invokeMainWindowEvent } from '../window/mainWindowHelper';

const handleIpc = () => {
    ipcMain.handle('notes/fetch-all', async (_event): Promise<Note[]> => {
        return getNotes();
    });
    ipcMain.handle('notes/updateNote', async (_event, note: Note): Promise<void> => {
        updateNote(note);
    });
}

export const invokeUpdateNotesEvent = (notes: Note[]) => {
    invokeMainWindowEvent('notes/update', notes);
}

export default handleIpc;