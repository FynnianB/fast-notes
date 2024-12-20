import { getNotes, insertNote } from '../database/repository/notes.repository';
import { NoteSyncStatus } from '../enumerations/NoteSyncStatus.enumation';
import { invokeUpdateNotesEvent } from '../ipc/notesIpc';
import logger from './logger.service';

export const addNote = (content: string): boolean => {
    try {
        const date = new Date();
        insertNote({
            content: content,
            lastModified: date,
            createdAt: date,
            category: null,
            syncStatus: NoteSyncStatus.PENDING,
            isDeleted: false,
            x: null,
            y: null,
        });
        const notes = getNotes();
        invokeUpdateNotesEvent(notes);
        // todo: Syncing logic
        // todo: send notification
        return true;
    } catch (e: unknown) {
        logger.error('Error while adding note', e);
        return false;
    }
}
