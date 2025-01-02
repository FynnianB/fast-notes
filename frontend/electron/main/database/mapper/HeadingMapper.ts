import { Heading as HeadingEntity } from '../entity/Heading';
import { Heading as HeadingModel } from '../../../@types/notes.type';
import { CanvasObject as CanvasObjectEntity } from '../entity/CanvasObject';
import { Category as CategoryEntity } from '../entity/category.entity';
import { CanvasObjectMapper } from './CanvasObjectMapper';
import { UiColorFromString } from '../../enumerations/UiColor.enumeration';

export class HeadingMapper {
    static toModel(entity: HeadingEntity, category: CategoryEntity|null, canvasObject: CanvasObjectEntity): HeadingModel {
        return {
            ...CanvasObjectMapper.toModel(canvasObject, category),
            text: entity.text,
            fontSize: entity.font_size,
            color: UiColorFromString(entity.color),
        };
    }

    static toEntity(model: HeadingModel): HeadingEntity {
        return {
            uuid: model.uuid,
            text: model.text,
            font_size: model.fontSize,
            color: model.color,
        };
    }
}
