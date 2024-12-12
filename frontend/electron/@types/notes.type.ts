import { NoteSyncStatus } from '../main/enumerations/NoteSyncStatus.enumation';

export type Note = {
    uuid: string;
    content: string;
    lastModified: Date;
    category: Category|null;
    syncStatus: NoteSyncStatus;
    isDeleted: boolean;
}

export type Category = {
    uuid: string;
    name: string;
    lastModified: Date;
}