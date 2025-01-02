import { BaseRepository } from './BaseRepository';
import { Heading as HeadingModel } from '../../../@types/notes.type';
import { Heading as HeadingEntity} from '../entity/Heading';
import { Category as CategoryEntity } from '../entity/category.entity';
import { CanvasObject as CanvasObjectEntity } from '../entity/CanvasObject';
import { v7 as uuidv7 } from 'uuid';
import { HeadingMapper } from '../mapper/HeadingMapper';
import { SyncQueueAction } from '../../enumerations/SyncQueueAction.enumeration';
import { CanvasObjectType } from '../../enumerations/CanvasObjectType';
import { CanvasObjectMapper } from '../mapper/CanvasObjectMapper';

export class HeadingRepository extends BaseRepository<HeadingModel> {
    insert(modelParams: Omit<HeadingModel, "uuid">): string {
        const uuid = uuidv7();
        const model: HeadingModel = {uuid, ...modelParams};
        const headingEntity = HeadingMapper.toEntity(model);
        const coEntity = CanvasObjectMapper.toEntity(model);
        const entity = {...coEntity, ...headingEntity};
        const date = new Date().toISOString();
        this.transaction((database) => {
            database.prepare('INSERT INTO canvas_object (uuid, type, last_modified, created_at, category_id, sync_status, is_deleted, x, y) VALUES (?,?,?,?,?,?,?,?,?)')
                .run([coEntity.uuid, CanvasObjectType.Heading, date, date, coEntity.category_id, coEntity.sync_status, coEntity.is_deleted ? 1 : 0, coEntity.x, coEntity.y]);
            database.prepare('INSERT INTO heading (uuid, text, font_size, color) VALUES (?,?,?,?)')
                .run([headingEntity.uuid, headingEntity.text, headingEntity.font_size, headingEntity.color]);
            database.prepare('INSERT INTO sync_queue (table_name, row_id, action, data, last_modified) VALUES (?,?,?,?,?)')
                .run(['heading', uuid, SyncQueueAction.INSERT, JSON.stringify(entity), date]);
        });
        return uuid;
    }

    update(model: HeadingModel): void {
        const headingEntity = HeadingMapper.toEntity(model);
        const coEntity = CanvasObjectMapper.toEntity(model);
        const entity = {...coEntity, ...headingEntity};
        const date = new Date().toISOString();
        this.transaction((database) => {
            database.prepare('UPDATE canvas_object SET type = ?, last_modified = ?, category_id = ?, sync_status = ?, is_deleted = ?, x = ?, y = ? WHERE uuid = ?')
                .run([CanvasObjectType.Heading, date, coEntity.category_id, coEntity.sync_status, coEntity.is_deleted ? 1 : 0, coEntity.x, coEntity.y, coEntity.uuid]);
            database.prepare('UPDATE heading SET text = ?, font_size = ?, color = ? WHERE uuid = ?')
                .run([headingEntity.text, headingEntity.font_size, headingEntity.color, headingEntity.uuid]);
            database.prepare('DELETE FROM sync_queue WHERE table_name = ? AND row_id = ? AND action = ?')
                .run(['heading', headingEntity.uuid, SyncQueueAction.UPDATE]);
            database.prepare('INSERT INTO sync_queue (table_name, row_id, action, data, last_modified) VALUES (?,?,?,?,?)')
                .run(['heading', headingEntity.uuid, SyncQueueAction.UPDATE, JSON.stringify(entity), date]);
        });
    }

    softDelete(uuid: string): void {
        const date = new Date().toISOString();
        this.transaction((database) => {
            database.prepare('UPDATE canvas_object SET is_deleted = 1, last_modified = ? WHERE uuid = ?')
                .run([date, uuid]);
            database.prepare('DELETE FROM sync_queue WHERE table_name = ? AND row_id = ? AND action = ?')
                .run(['heading', uuid, SyncQueueAction.DELETE]);
            database.prepare('INSERT INTO sync_queue (table_name, row_id, action, data, last_modified) VALUES (?,?,?,?,?)')
                .run(['heading', uuid, SyncQueueAction.DELETE, null, date]);
        });
    }

    delete(uuid: string): void {
        this.db.prepare('DELETE FROM canvas_object WHERE uuid = ?').run([uuid]);
    }

    findById(uuid: string): HeadingModel | null {
        const entity = this.db
            .prepare(`SELECT * FROM heading
                LEFT JOIN canvas_object ON heading.uuid = canvas_object.uuid
                LEFT JOIN category ON canvas_object.category_id = category.uuid
                WHERE canvas_object.type = 'heading' AND heading.uuid = ?`)
            .expand()
            .get([uuid]) as { heading: HeadingEntity, category: CategoryEntity, canvas_object: CanvasObjectEntity } | undefined;
        if (!entity) return null;
        return HeadingMapper.toModel(entity.heading, entity.category, entity.canvas_object);
    }

    findAll(): HeadingModel[] {
        const entities = this.db
            .prepare(`SELECT * FROM heading
                LEFT JOIN canvas_object ON heading.uuid = canvas_object.uuid
                LEFT JOIN category ON canvas_object.category_id = category.uuid
                WHERE canvas_object.type = 'heading' AND canvas_object.is_deleted = 0
                ORDER BY canvas_object.uuid DESC`)
            .expand()
            .all() as { heading: HeadingEntity, category: CategoryEntity, canvas_object: CanvasObjectEntity }[];
        return entities.map(entity => HeadingMapper.toModel(entity.heading, entity.category, entity.canvas_object));
    }
}
