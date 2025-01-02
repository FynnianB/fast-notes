import { CanvasObject, CanvasObjectTyped } from '../../@types/notes.type';
import { CanvasObjectRepository } from '../database/repository/CanvasObjectRepository';

class CanvasObjectService {
    private canvasObjectRepository: CanvasObjectRepository;

    constructor() {
        this.canvasObjectRepository = new CanvasObjectRepository();
    }

    updateCanvasObject(model: CanvasObject): void {
        this.canvasObjectRepository.update(model);
        // todo: Syncing logic
    }

    softDeleteCanvasObject(uuid: string): void {
        this.canvasObjectRepository.softDelete(uuid);
        // todo: Syncing logic
    }

    bulkUpdateCanvasObjects(models: CanvasObject[]): void {
        this.canvasObjectRepository.bulkUpdate(models);
    }

    bulkSoftDeleteCanvasObjects(uuids: string[]): void {
        this.canvasObjectRepository.bulkSoftDelete(uuids);
    }

    findAllTyped(): CanvasObjectTyped[] {
        return this.canvasObjectRepository.findAllTyped();
    }
}

export default new CanvasObjectService();
