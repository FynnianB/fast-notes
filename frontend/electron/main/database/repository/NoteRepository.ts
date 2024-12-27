import { BaseRepository } from './BaseRepository';
import { Note as NoteModel } from '../../../@types/notes.type';
import { Note as NoteEntity} from '../entity/Note';
import { Category as CategoryEntity } from '../entity/category.entity';
import { CanvasObject as CanvasObjectEntity } from '../entity/CanvasObject';
import { v7 as uuidv7 } from 'uuid';
import { NoteMapper } from '../mapper/NoteMapper';
import { SyncQueueAction } from '../../enumerations/SyncQueueAction.enumeration';
import { CanvasObjectType } from '../../enumerations/CanvasObjectType';
import { CanvasObjectMapper } from '../mapper/CanvasObjectMapper';

export class NoteRepository extends BaseRepository<NoteModel> {
    insert(modelParams: Omit<NoteModel, "uuid">): string {
        const uuid = uuidv7();
        const model: NoteModel = {uuid, ...modelParams};
        const noteEntity = NoteMapper.toEntity(model);
        const coEntity = CanvasObjectMapper.toEntity(model);
        const entity = {...coEntity, ...noteEntity};
        const date = new Date().toISOString();
        this.transaction((database) => {
            database.prepare('INSERT INTO canvas_object (uuid, type, last_modified, created_at, category_id, sync_status, is_deleted, x, y) VALUES (?,?,?,?,?,?,?,?,?)')
                .run([coEntity.uuid, CanvasObjectType.Note, date, date, coEntity.category_id, coEntity.sync_status, coEntity.is_deleted ? 1 : 0, coEntity.x, coEntity.y]);
            database.prepare('INSERT INTO note (uuid, content) VALUES (?,?)')
                .run([noteEntity.uuid, noteEntity.content]);
            database.prepare('INSERT INTO sync_queue (table_name, row_id, action, data, last_modified) VALUES (?,?,?,?,?)')
                .run(['note', uuid, SyncQueueAction.INSERT, JSON.stringify(entity), date]);
        });
        return uuid;
    }

    update(model: NoteModel): void {
        const noteEntity = NoteMapper.toEntity(model);
        const coEntity = CanvasObjectMapper.toEntity(model);
        const entity = {...coEntity, ...noteEntity};
        const date = new Date().toISOString();
        this.transaction((database) => {
            database.prepare('UPDATE canvas_object SET type = ?, last_modified = ?, category_id = ?, sync_status = ?, is_deleted = ?, x = ?, y = ? WHERE uuid = ?')
                .run([CanvasObjectType.Note, date, coEntity.category_id, coEntity.sync_status, coEntity.is_deleted ? 1 : 0, coEntity.x, coEntity.y, coEntity.uuid]);
            database.prepare('UPDATE note SET content = ? WHERE uuid = ?')
                .run([noteEntity.content, noteEntity.uuid]);
            database.prepare('DELETE FROM sync_queue WHERE table_name = ? AND row_id = ? AND action = ?')
                .run(['note', noteEntity.uuid, SyncQueueAction.UPDATE]);
            database.prepare('INSERT INTO sync_queue (table_name, row_id, action, data, last_modified) VALUES (?,?,?,?,?)')
                .run(['note', noteEntity.uuid, SyncQueueAction.UPDATE, JSON.stringify(entity), date]);
        });
    }

    softDelete(uuid: string): void {
        const date = new Date().toISOString();
        this.transaction((database) => {
            database.prepare('UPDATE canvas_object SET is_deleted = 1, last_modified = ? WHERE uuid = ?')
                .run([date, uuid]);
            database.prepare('DELETE FROM sync_queue WHERE table_name = ? AND row_id = ? AND action = ?')
                .run(['note', uuid, SyncQueueAction.DELETE]);
            database.prepare('INSERT INTO sync_queue (table_name, row_id, action, data, last_modified) VALUES (?,?,?,?,?)')
                .run(['note', uuid, SyncQueueAction.DELETE, null, date]);
        });
    }

    delete(uuid: string): void {
        this.db.prepare('DELETE FROM canvas_object WHERE uuid = ?').run([uuid]);
    }

    bulkMoveToDrawer(uuids: string[]): void {
        const updateStmt = this.db.prepare('UPDATE canvas_object SET x = NULL, y = NULL, last_modified = ? WHERE uuid = ?');
        const getNotesStmt = this.db.prepare('SELECT * FROM note WHERE uuid = ?');
        const deleteSyncQueueStmt = this.db.prepare('DELETE FROM sync_queue WHERE table_name = ? AND row_id = ? AND action = ?');
        const insertSyncQueueStmt = this.db.prepare('INSERT INTO sync_queue (table_name, row_id, action, data, last_modified) VALUES (?,?,?,?,?)');
        const date = new Date().toISOString();
        this.transaction(() => {
            for (const uuid of uuids) {
                updateStmt.run(date, uuid);
                deleteSyncQueueStmt.run('note', uuid, SyncQueueAction.UPDATE);
                const entity = getNotesStmt.get(uuid) as NoteEntity;
                insertSyncQueueStmt.run('note', uuid, SyncQueueAction.UPDATE, JSON.stringify(entity), date);
            }
        });
    }

    findById(uuid: string): NoteModel | null {
        const entity = this.db
            .prepare(`SELECT * FROM note
                LEFT JOIN canvas_object ON note.uuid = canvas_object.uuid
                LEFT JOIN category ON canvas_object.category_id = category.uuid
                WHERE canvas_object.type = 'note' AND note.uuid = ?`)
            .expand()
            .get([uuid]) as { note: NoteEntity, category: CategoryEntity, canvas_object: CanvasObjectEntity } | undefined;
        if (!entity) return null;
        return NoteMapper.toModel(entity.note, entity.category, entity.canvas_object);
    }

    findAll(): NoteModel[] {
        const entities = this.db
            .prepare(`SELECT * FROM note
                LEFT JOIN canvas_object ON note.uuid = canvas_object.uuid
                LEFT JOIN category ON canvas_object.category_id = category.uuid
                WHERE canvas_object.type = 'note' AND canvas_object.is_deleted = 0
                ORDER BY canvas_object.uuid DESC`)
            .expand()
            .all() as { note: NoteEntity, category: CategoryEntity, canvas_object: CanvasObjectEntity }[];
        return entities.map(entity => NoteMapper.toModel(entity.note, entity.category, entity.canvas_object));
    }
}
