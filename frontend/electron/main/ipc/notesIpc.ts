import { ipcMain } from 'electron';
import { Note } from '../../@types/notes.type';
import { getNotes } from '../database/repository/notes.repository';
import { invokeMainWindowEvent } from '../window/mainWindowHelper';
import { bulkDeleteNotes, bulkMoveNotesToDrawer, bulkUpdateNotes, updateNote } from '../services/notes.service';

const handleIpc = () => {
    ipcMain.handle('notes/fetch-all', async (_event): Promise<Note[]> => {
        return getNotes();
    });
    ipcMain.handle('notes/updateNote', async (_event, note: Note): Promise<void> => {
        updateNote(note);
    });
    ipcMain.handle('notes/bulkUpdateNotes', async (_event, notes: Note[]): Promise<void> => {
        bulkUpdateNotes(notes);
    });
    ipcMain.handle('notes/bulkMoveToDrawer', async (_event, noteIds: string[]): Promise<void> => {
        bulkMoveNotesToDrawer(noteIds);
    });
    ipcMain.handle('notes/bulkDelete', async (_event, noteIds: string[]): Promise<void> => {
        bulkDeleteNotes(noteIds);
    });
}

export const invokeUpdateNotesEvent = (notes: Note[]) => {
    invokeMainWindowEvent('notes/update', notes);
}

export default handleIpc;
