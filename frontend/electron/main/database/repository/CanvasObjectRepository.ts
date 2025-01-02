import { BaseRepository } from './BaseRepository';
import { CanvasObject, CanvasObjectTyped } from '../../../@types/notes.type';
import { CanvasObjectMapper } from '../mapper/CanvasObjectMapper';
import { CanvasObject as CanvasObjectEntity } from '../entity/CanvasObject';
import { Note as NoteEntity } from '../entity/Note';
import { Heading as HeadingEntity } from '../entity/Heading';
import { Category as CategoryEntity } from '../entity/category.entity';
import { SyncQueueAction } from '../../enumerations/SyncQueueAction.enumeration';

export class CanvasObjectRepository extends BaseRepository<CanvasObject> {
    insert(model: Omit<CanvasObject, 'uuid'>): string {
        throw new Error('This method should not be called. Please use the insert method of the specific type.');
    }

    update(model: CanvasObject): void {
        const entity = CanvasObjectMapper.toEntity(model);
        const date = new Date().toISOString();
        this.transaction((database) => {
            database.prepare('UPDATE canvas_object SET type = ?, last_modified = ?, category_id = ?, sync_status = ?, is_deleted = ?, x = ?, y = ? WHERE uuid = ?')
                .run([entity.type, date, entity.category_id, entity.sync_status, entity.is_deleted ? 1 : 0, entity.x, entity.y, entity.uuid]);
            database.prepare('DELETE FROM sync_queue WHERE table_name = ? AND row_id = ? AND action = ?')
                .run([entity.type, entity.uuid, SyncQueueAction.UPDATE]);
            database.prepare('INSERT INTO sync_queue (table_name, row_id, action, data, last_modified) VALUES (?,?,?,?,?)')
                .run([entity.type, entity.uuid, SyncQueueAction.UPDATE, JSON.stringify(entity), date]);
        });
    }

    softDelete(uuid: string): void {
        const date = new Date().toISOString();
        this.transaction((database) => {
            database.prepare('UPDATE canvas_object SET is_deleted = 1, last_modified = ? WHERE uuid = ?')
                .run([date, uuid]);
            const entity = this.db.prepare('SELECT * FROM canvas_object WHERE uuid = ?').get([uuid]) as CanvasObjectEntity;
            database.prepare('DELETE FROM sync_queue WHERE table_name = ? AND row_id = ? AND action = ?')
                .run([entity.type, uuid, SyncQueueAction.DELETE]);
            database.prepare('INSERT INTO sync_queue (table_name, row_id, action, data, last_modified) VALUES (?,?,?,?,?)')
                .run([entity.type, uuid, SyncQueueAction.DELETE, null, date]);
        });
    }

    delete(uuid: string): void {
        this.db.prepare('DELETE FROM canvas_object WHERE uuid = ?').run([uuid]);
    }

    bulkUpdate(models: CanvasObject[]): void {
        const updateStmt = this.db.prepare('UPDATE canvas_object SET type = ?, last_modified = ?, category_id = ?, sync_status = ?, is_deleted = ?, x = ?, y = ? WHERE uuid = ?');
        const deleteSyncQueueStmt = this.db.prepare('DELETE FROM sync_queue WHERE table_name = ? AND row_id = ? AND action = ?');
        const insertSyncQueueStmt = this.db.prepare('INSERT INTO sync_queue (table_name, row_id, action, data, last_modified) VALUES (?,?,?,?,?)');
        const date = new Date().toISOString();
        this.transaction(() => {
            for (const model of models) {
                const entity = CanvasObjectMapper.toEntity(model);
                updateStmt.run(entity.type, date, entity.category_id, entity.sync_status, entity.is_deleted ? 1 : 0, entity.x, entity.y, entity.uuid);
                deleteSyncQueueStmt.run(entity.type, entity.uuid, SyncQueueAction.UPDATE);
                insertSyncQueueStmt.run(entity.type, entity.uuid, SyncQueueAction.UPDATE, JSON.stringify(entity), date);
            }
        });
    }

    bulkSoftDelete(uuids: string[]): void {
        const deleteStmt = this.db.prepare('UPDATE canvas_object SET is_deleted = 1, last_modified = ? WHERE uuid = ?');
        const getEntityStmt = this.db.prepare('SELECT * FROM canvas_object WHERE uuid = ?');
        const deleteSyncQueueStmt = this.db.prepare('DELETE FROM sync_queue WHERE table_name = ? AND row_id = ? AND action = ?');
        const insertSyncQueueStmt = this.db.prepare('INSERT INTO sync_queue (table_name, row_id, action, data, last_modified) VALUES (?,?,?,?,?)');
        const date = new Date().toISOString();
        this.transaction(() => {
            for (const uuid of uuids) {
                deleteStmt.run(date, uuid)
                const entity = getEntityStmt.get([uuid]) as CanvasObjectEntity;
                deleteSyncQueueStmt.run(entity.type, uuid, SyncQueueAction.DELETE);
                insertSyncQueueStmt.run(entity.type, uuid, SyncQueueAction.DELETE, null, date);
            }
        });
    }

    findById(uuid: string): CanvasObject | null {
        const entity = this.db
            .prepare(`SELECT * FROM canvas_object
                LEFT JOIN category ON canvas_object.category_id = category.uuid
                WHERE canvas_object.uuid = ?`)
            .expand()
            .get([uuid]) as { canvas_object: CanvasObjectEntity, category: CategoryEntity } | undefined;
        if (!entity) return null;
        return CanvasObjectMapper.toModel(entity.canvas_object, entity.category);
    }

    findAll(): CanvasObject[] {
        const entities = this.db
            .prepare(`SELECT * FROM canvas_object
                LEFT JOIN category ON canvas_object.category_id = category.uuid
                WHERE canvas_object.is_deleted = 0 ORDER BY canvas_object.uuid DESC`)
            .expand()
            .all() as { canvas_object: CanvasObjectEntity, category: CategoryEntity }[];
        return entities.map(entity => CanvasObjectMapper.toModel(entity.canvas_object, entity.category));
    }

    findAllTyped(): CanvasObjectTyped[] {
        const entities = this.db
            .prepare(`SELECT * FROM canvas_object AS co
                LEFT JOIN category ON co.category_id = category.uuid
                LEFT JOIN note ON co.type = 'Note' AND co.uuid = note.uuid
                LEFT JOIN heading ON co.type = 'Heading' AND co.uuid = heading.uuid
                WHERE co.is_deleted = 0 ORDER BY co.uuid DESC`)
            .expand()
            .all() as { canvas_object: CanvasObjectEntity, category: CategoryEntity, note: NoteEntity, heading: HeadingEntity }[];
        return entities.map(entity =>
            CanvasObjectMapper.toTypedModel(entity.canvas_object, entity.category, entity.note, entity.heading)
        );
    }
}
