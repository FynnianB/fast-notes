import { NoteSyncStatus } from '../../enumerations/NoteSyncStatus.enumation';

export interface Note {
    uuid: string;
    content: string;
    lastModified: Date;
    categoryId: string|null;
    syncStatus: NoteSyncStatus;
    isDeleted: boolean;
}