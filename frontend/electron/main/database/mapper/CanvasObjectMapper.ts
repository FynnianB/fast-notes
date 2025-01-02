import { CanvasObject as CanvasObjectEntity } from '../entity/CanvasObject';
import { Category as CategoryEntity } from '../entity/category.entity';
import { Note as NoteEntity } from '../entity/Note';
import { Heading as HeadingEntity } from '../entity/Heading';
import { CanvasObject as CanvasObjectModel, Heading as HeadingModel, Note as NoteModel } from '../../../@types/notes.type';
import { CanvasObjectType } from '../../enumerations/CanvasObjectType';
import { NoteMapper } from './NoteMapper';
import { HeadingMapper } from './HeadingMapper';

export class CanvasObjectMapper {
    static toModel(entity: CanvasObjectEntity, category: CategoryEntity|null): CanvasObjectModel {
        return {
            uuid: entity.uuid,
            type: entity.type,
            lastModified: new Date(entity.last_modified),
            createdAt: new Date(entity.created_at),
            category: category?.uuid === null ? null : category,
            syncStatus: entity.sync_status,
            isDeleted: entity.is_deleted,
            x: entity.x,
            y: entity.y,
        };
    }
    static toEntity(model: Required<CanvasObjectModel>): CanvasObjectEntity {
        return {
            uuid: model.uuid,
            type: model.type,
            last_modified: model.lastModified.toISOString(),
            created_at: model.createdAt.toISOString(),
            category_id: model.category?.uuid ?? null,
            sync_status: model.syncStatus,
            is_deleted: model.isDeleted,
            x: model.x,
            y: model.y,
        };
    }

    static toTypedModel(
        canvasObject: CanvasObjectEntity,
        category: CategoryEntity|null,
        note: NoteEntity|null,
        heading: HeadingEntity|null,
    ): (NoteModel | HeadingModel) {
        if (canvasObject.type === CanvasObjectType.Note && note) {
            return NoteMapper.toModel(note, category, canvasObject);
        } else if (canvasObject.type === CanvasObjectType.Heading && heading) {
            return HeadingMapper.toModel(heading, category, canvasObject);
        }
        throw new Error(`Invalid canvas object type: ${canvasObject.type}`);
    }
}
