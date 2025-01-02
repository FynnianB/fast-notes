import { sqlite } from '../sqlite';
import {v7 as uuidv7} from 'uuid';
import { Note as NoteEntity } from '../entity/note.entity';
import { Note as NoteModel } from '../../../@types/notes.type';
import { SyncQueueAction } from '../../enumerations/SyncQueueAction.enumeration';
import { Category } from '../entity/category.entity';
import * as notesMapper from '../mapper/notes.mapper';

export function insertNote(modelParams: Omit<NoteModel, "uuid">): void {
    const uuid = uuidv7();
    const model: NoteModel = {uuid, ...modelParams};
    const entity = notesMapper.mapModelToEntity(model);
    sqlite.transaction((sqlite) => {
        sqlite.run(
            'INSERT INTO note (uuid, content, last_modified, created_at, category_id, sync_status, is_deleted, x, y) VALUES (?,?,?,?,?,?,?,?,?)',
            [entity.uuid, entity.content, entity.last_modified, entity.created_at, entity.category_id, entity.sync_status, entity.is_deleted ? 1 : 0, entity.x, entity.y]
        );
        sqlite.run(
            'INSERT INTO sync_queue (table_name, row_id, action, data, last_modified) VALUES (?,?,?,?,?)',
            ['note', uuid, SyncQueueAction.INSERT, JSON.stringify(model), new Date().toISOString()]
        );
    })
}

export function updateNote(model: NoteModel): void {
    const entity = notesMapper.mapModelToEntity(model);
    const date = new Date().toISOString();
    sqlite.transaction((sqlite) => {
        sqlite.run(
            'UPDATE note SET content = ?, last_modified = ?, category_id = ?, sync_status = ?, is_deleted = ?, x = ?, y = ? WHERE uuid = ?',
            [entity.content, date, entity.category_id, entity.sync_status, entity.is_deleted ? 1 : 0, entity.x, entity.y, entity.uuid]
        );
        sqlite.run(
            'DELETE FROM sync_queue WHERE table_name = ? AND row_id = ? AND action = ?',
            ['note', entity.uuid, SyncQueueAction.UPDATE]
        );
        sqlite.run(
            'INSERT INTO sync_queue (table_name, row_id, action, data, last_modified) VALUES (?,?,?,?,?)',
            ['note', entity.uuid, SyncQueueAction.UPDATE, JSON.stringify(entity), date]
        );
    })
}

export function bulkUpdateNotes(models: NoteModel[]): void {
    const updateStmt = sqlite.db.prepare('UPDATE note SET content = ?, last_modified = ?, category_id = ?, sync_status = ?, is_deleted = ?, x = ?, y = ? WHERE uuid = ?');
    const deleteSyncQueueStmt = sqlite.db.prepare('DELETE FROM sync_queue WHERE table_name = ? AND row_id = ? AND action = ?');
    const insertSyncQueueStmt = sqlite.db.prepare('INSERT INTO sync_queue (table_name, row_id, action, data, last_modified) VALUES (?,?,?,?,?)');
    const date = new Date().toISOString();
    sqlite.transaction(() => {
        for (const model of models) {
            const entity = notesMapper.mapModelToEntity(model);
            updateStmt.run(entity.content, date, entity.category_id, entity.sync_status, entity.is_deleted ? 1 : 0, entity.x, entity.y, entity.uuid);
            deleteSyncQueueStmt.run('note', entity.uuid, SyncQueueAction.UPDATE);
            insertSyncQueueStmt.run('note', entity.uuid, SyncQueueAction.UPDATE, JSON.stringify(entity), date);
        }
    })
}

export function bulkMoveNotesToDrawer(uuids: string[]): void {
    const updateStmt = sqlite.db.prepare('UPDATE note SET x = NULL, y = NULL, last_modified = ? WHERE uuid = ?');
    const getNotesStmt = sqlite.db.prepare('SELECT * FROM note WHERE uuid = ?');
    const deleteSyncQueueStmt = sqlite.db.prepare('DELETE FROM sync_queue WHERE table_name = ? AND row_id = ? AND action = ?');
    const insertSyncQueueStmt = sqlite.db.prepare('INSERT INTO sync_queue (table_name, row_id, action, data, last_modified) VALUES (?,?,?,?,?)');
    const date = new Date().toISOString();
    sqlite.transaction(() => {
        for (const uuid of uuids) {
            updateStmt.run(date, uuid);
            deleteSyncQueueStmt.run('note', uuid, SyncQueueAction.UPDATE);
            const entity = getNotesStmt.get(uuid) as NoteEntity;
            insertSyncQueueStmt.run('note', uuid, SyncQueueAction.UPDATE, JSON.stringify(entity), date);
        }
    })
}

export function bulkDeleteNotes(uuids: string[]): void {
    const deleteStmt = sqlite.db.prepare('UPDATE note SET is_deleted = 1, last_modified = ? WHERE uuid = ?');
    const deleteSyncQueueStmt = sqlite.db.prepare('DELETE FROM sync_queue WHERE table_name = ? AND row_id = ? AND action = ?');
    const insertSyncQueueStmt = sqlite.db.prepare('INSERT INTO sync_queue (table_name, row_id, action, data, last_modified) VALUES (?,?,?,?,?)');
    const date = new Date().toISOString();
    sqlite.transaction(() => {
        for (const uuid of uuids) {
            deleteStmt.run(date, uuid)
            deleteSyncQueueStmt.run('note', uuid, SyncQueueAction.DELETE);
            insertSyncQueueStmt.run('note', uuid, SyncQueueAction.DELETE, null, date);
        }
    })
}

export function getNotes(): NoteModel[] {
    const result = sqlite.all(
        'SELECT * FROM note LEFT JOIN category ON note.category_id = category.uuid WHERE note.is_deleted = 0 ORDER BY note.uuid DESC',
    ) as { note: NoteEntity, category: Category }[];
    return result.map(entity => notesMapper.mapEntityToModel(entity.note, entity.category));
}
