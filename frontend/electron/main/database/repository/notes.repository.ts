import { sqlite } from '../sqlite';
import {v7 as uuidv7} from 'uuid';
import { Note as NoteEntity } from '../entity/note.entity';
import { Note as NoteModel } from '../../../@types/notes.type';
import { SyncQueueAction } from '../../enumerations/SyncQueueAction.enumeration';
import { Category } from '../entity/category.entity';
import * as notesMapper from '../mapper/notes.mapper';

export function insertNote({
    content, lastModified, category, syncStatus, isDeleted
}: Omit<NoteModel, "uuid">): void {
    const uuid = uuidv7();
    const categoryId = category?.uuid ?? null;
    const noteObject: NoteEntity = {
        uuid, content, last_modified: lastModified, category_id: categoryId, sync_status: syncStatus, is_deleted: isDeleted
    }
    const sqlFormattedLastModified = lastModified.toISOString().slice(0, 19).replace('T', ' ');
    sqlite.transaction((sqlite) => {
        sqlite.run(
            'INSERT INTO note (uuid, content, last_modified, category_id, sync_status, is_deleted) VALUES (?,?,?,?,?,?)',
            [uuid, content, sqlFormattedLastModified, categoryId, syncStatus, isDeleted ? 1 : 0]
        );
        sqlite.run(
            'INSERT INTO sync_queue (table_name, row_id, action, data, last_modified) VALUES (?,?,?,?,?)',
            ['note', uuid, SyncQueueAction.INSERT, JSON.stringify(noteObject), sqlFormattedLastModified]
        );
    })
}

export function getNotes(): NoteModel[] {
    const result = sqlite.all('SELECT * FROM note LEFT JOIN category ON note.category_id = category.uuid ORDER BY note.uuid DESC') as { note: NoteEntity, category: Category }[];
    return result.map(entity => notesMapper.mapEntityToModel(entity.note, entity.category));
}