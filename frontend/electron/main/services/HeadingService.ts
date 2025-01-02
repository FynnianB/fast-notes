import { HeadingRepository } from '../database/repository/HeadingRepository';
import { NoteSyncStatus } from '../enumerations/NoteSyncStatus.enumation';
import { CanvasObjectType } from '../enumerations/CanvasObjectType';
import { Heading } from '../../@types/notes.type';

class HeadingService {
    private headingRepository: HeadingRepository;

    constructor() {
        this.headingRepository = new HeadingRepository();
    }

    addHeading(headingData: Pick<Heading, 'text'|'fontSize'|'color'|'x'|'y'>): void {
        const date = new Date();
        this.headingRepository.insert({
            type: CanvasObjectType.Heading,
            text: headingData.text,
            fontSize: headingData.fontSize,
            color: headingData.color,
            lastModified: date,
            createdAt: date,
            category: null,
            syncStatus: NoteSyncStatus.PENDING,
            isDeleted: false,
            x: headingData.x,
            y: headingData.y,
        });
        // todo: Syncing logic
    }

    updateHeading(model: Heading): void {
        this.headingRepository.update(model);
        // todo: Syncing logic
    }
}

export default new HeadingService();
