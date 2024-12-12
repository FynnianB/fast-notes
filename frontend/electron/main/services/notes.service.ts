import { getNotes, insertNote } from '../database/repository/notes.repository';
import { NoteSyncStatus } from '../enumerations/NoteSyncStatus.enumation';
import { invokeUpdateNotesEvent } from '../ipc/notesIpc';

export const addNote = (content: string): boolean => {
    try {
        insertNote({
            content: content,
            lastModified: new Date(),
            category: null,
            syncStatus: NoteSyncStatus.PENDING,
            isDeleted: false
        });
        const notes = getNotes();
        invokeUpdateNotesEvent(notes);
        // todo: Syncing logic
        // todo: send notification
        return true;
    } catch (e: unknown) {
        console.error(e);
        return false;
    }
}