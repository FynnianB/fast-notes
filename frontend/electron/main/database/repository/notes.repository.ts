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
            ['note', uuid, SyncQueueAction.INSERT, JSON.stringify(model), entity.last_modified]
        );
    })
}

export function updateNote(model: NoteModel): void {
    const entity = notesMapper.mapModelToEntity(model);
    sqlite.transaction((sqlite) => {
        sqlite.run(
            'UPDATE note SET content = ?, last_modified = ?, category_id = ?, sync_status = ?, is_deleted = ?, x = ?, y = ? WHERE uuid = ?',
            [entity.content, entity.last_modified, entity.category_id, entity.sync_status, entity.is_deleted ? 1 : 0, entity.x, entity.y, entity.uuid]
        );
        sqlite.run(
            'INSERT INTO sync_queue (table_name, row_id, action, data, last_modified) VALUES (?,?,?,?,?)',
            ['note', model.uuid, SyncQueueAction.UPDATE, JSON.stringify(model), entity.last_modified]
        );
    })
}

export function getNotes(): NoteModel[] {
    const result = sqlite.all(
        'SELECT * FROM note LEFT JOIN category ON note.category_id = category.uuid WHERE note.is_deleted = 0 ORDER BY note.uuid DESC',
    ) as { note: NoteEntity, category: Category }[];
    return result.map(entity => notesMapper.mapEntityToModel(entity.note, entity.category));
}

export function getAllNotes(): NoteModel[] {
    const result = sqlite.all('SELECT * FROM note LEFT JOIN category ON note.category_id = category.uuid ORDER BY note.uuid DESC') as { note: NoteEntity, category: Category }[];
    return result.map(entity => notesMapper.mapEntityToModel(entity.note, entity.category));
}
