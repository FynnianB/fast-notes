import { NoteSyncStatus } from '../../enumerations/NoteSyncStatus.enumation';
import { CanvasObjectType } from '../../enumerations/CanvasObjectType';

export interface CanvasObject {
    uuid: string;
    type: CanvasObjectType;
    last_modified: string;
    created_at: string;
    category_id: string|null;
    sync_status: NoteSyncStatus;
    is_deleted: boolean;
    x: number|null;
    y: number|null;
}
