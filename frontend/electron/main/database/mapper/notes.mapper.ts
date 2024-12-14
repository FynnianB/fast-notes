import { Note as NoteEntity } from '../entity/note.entity';
import { Note as NoteModel } from '../../../@types/notes.type';
import { Category as CategoryEntity } from '../entity/category.entity';

export const mapModelToEntity = (model: NoteModel): NoteEntity => {
    return {
        uuid: model.uuid,
        content: model.content,
        last_modified: model.lastModified.toISOString().slice(0, 19).replace('T', ' '),
        created_at: model.createdAt.toISOString().slice(0, 19).replace('T', ' '),
        category_id: model.category?.uuid ?? null,
        sync_status: model.syncStatus,
        is_deleted: model.isDeleted,
        x: model.x,
        y: model.y,
    }
}

export const mapEntityToModel = (entity: NoteEntity, category: CategoryEntity): NoteModel => {
    return {
        uuid: entity.uuid,
        content: entity.content,
        lastModified: new Date(entity.last_modified),
        createdAt: new Date(entity.created_at),
        category: category.uuid === null ? null : category,
        syncStatus: entity.sync_status,
        isDeleted: entity.is_deleted,
        x: entity.x,
        y: entity.y,
    }
}