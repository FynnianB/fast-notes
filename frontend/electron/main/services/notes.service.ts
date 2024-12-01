import { insertNote } from '../database/repository/notes.repository';
import { NoteSyncStatus } from '../enumerations/NoteSyncStatus.enumation';

export const addNote = (content: string): boolean => {
    try {
        insertNote({
            content: content,
            lastModified: new Date(),
            categoryId: null,
            syncStatus: NoteSyncStatus.PENDING,
            isDeleted: false
        });
        // todo: Syncing logic
        // todo: send notification
        return true;
    } catch (e: unknown) {
        console.error(e);
        return false;
    }
}