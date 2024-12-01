import { sqlite } from '../sqlite';
import {v7 as uuidv7} from 'uuid';
import { Note } from '../entity/note.entity';
import { SyncQueueAction } from '../../enumerations/SyncQueueAction.enumeration';

export function insertNote({
    content, lastModified, categoryId, syncStatus, isDeleted
}: Omit<Note, "uuid">): void {
    const uuid = uuidv7();
    const noteObject: Note = {
        uuid, content, lastModified, categoryId, syncStatus, isDeleted
    }
    const sqlFormattedLastModified = lastModified.toISOString().slice(0, 19).replace('T', ' ');
    sqlite.transaction((sqlite) => {
        sqlite.run(
            'INSERT INTO notes (uuid, content, last_modified, category_id, sync_status, is_deleted) VALUES (?,?,?,?,?,?)',
            [uuid, content, sqlFormattedLastModified, categoryId, syncStatus, isDeleted ? 1 : 0]
        );
        sqlite.run(
            'INSERT INTO sync_queue (table_name, row_id, action, data, last_modified) VALUES (?,?,?,?,?)',
            ['notes', uuid, SyncQueueAction.INSERT, JSON.stringify(noteObject), sqlFormattedLastModified]
        );
    })
}
export function updateNote(note: Note): void {
    sqlite.run(`
        UPDATE notes
        SET content = ?, last_modified = ?, category_id = ?, sync_status = ?, is_deleted = ?
        WHERE uuid = ?
    `, [note.content, note.lastModified, note.categoryId, note.syncStatus, note.isDeleted, note.uuid]);
}

export function getNotes(): Note[] {
    return sqlite.all('SELECT * FROM notes ORDER BY uuid DESC') as Note[];
}

export function deleteNoteById(id: number): void {
    sqlite.run('DELETE FROM notes WHERE uuid = ?', [id]);
}