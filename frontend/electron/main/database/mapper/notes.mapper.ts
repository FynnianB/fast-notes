import { Note as NoteEntity } from '../entity/note.entity';
import { Note as NoteModel } from '../../../@types/notes.type';
import { Category as CategoryEntity } from '../entity/category.entity';

export const mapModelToEntity = (model: NoteModel): NoteEntity => {
    return {
        uuid: model.uuid,
        content: model.content,
        last_modified: model.lastModified,
        category_id: model.category?.uuid ?? null,
        sync_status: model.syncStatus,
        is_deleted: model.isDeleted,
    }
}

export const mapEntityToModel = (entity: NoteEntity, category: CategoryEntity): NoteModel => {
    return {
        uuid: entity.uuid,
        content: entity.content,
        lastModified: entity.last_modified,
        category: category.uuid === null ? null : category,
        syncStatus: entity.sync_status,
        isDeleted: entity.is_deleted,
    }
}