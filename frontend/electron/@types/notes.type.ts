import { NoteSyncStatus } from '../main/enumerations/NoteSyncStatus.enumation';

export type Note = {
    uuid: string;
    content: string;
    lastModified: Date;
    createdAt: Date;
    category: Category|null;
    syncStatus: NoteSyncStatus;
    isDeleted: boolean;
    x: number|null;
    y: number|null;
}

export type Category = {
    uuid: string;
    name: string;
    lastModified: Date;
}