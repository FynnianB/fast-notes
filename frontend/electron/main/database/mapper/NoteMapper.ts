import { Note as NoteEntity } from '../entity/Note';
import { Note as NoteModel } from '../../../@types/notes.type';
import { CanvasObject as CanvasObjectEntity } from '../entity/CanvasObject';
import { Category as CategoryEntity } from '../entity/category.entity';
import { CanvasObjectMapper } from './CanvasObjectMapper';

export class NoteMapper {
    static toModel(entity: NoteEntity, category: CategoryEntity|null, canvasObject: CanvasObjectEntity): NoteModel {
        return {
            ...CanvasObjectMapper.toModel(canvasObject, category),
            content: entity.content,
        };
    }

    static toEntity(model: NoteModel): NoteEntity {
        return {
            uuid: model.uuid,
            content: model.content,
        };
    }
}
