import { NoteSyncStatus } from '../main/enumerations/NoteSyncStatus.enumation';
import { CanvasObjectType } from '../main/enumerations/CanvasObjectType';
import { UiColor } from '../main/enumerations/UiColor.enumeration';

export interface CanvasObject {
    uuid: string;
    type: CanvasObjectType;
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

export interface Note extends CanvasObject {
    content: string;
}

export interface Heading extends CanvasObject {
    text: string;
    fontSize: number;
    color: UiColor;
}

export type CanvasObjectTyped = Note | Heading;
