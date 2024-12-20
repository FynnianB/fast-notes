import { ipcMain } from 'electron';
import { Note } from '../../@types/notes.type';
import { getNotes } from '../database/repository/notes.repository';
import { invokeMainWindowEvent } from '../window/mainWindowHelper';
import { updateNote } from '../services/notes.service';

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
