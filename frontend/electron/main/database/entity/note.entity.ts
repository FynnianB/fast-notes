import { NoteSyncStatus } from '../../enumerations/NoteSyncStatus.enumation';

export interface Note {
    uuid: string;
    content: string;
    last_modified: string;
    created_at: string;
    category_id: string|null;
    sync_status: NoteSyncStatus;
    is_deleted: boolean;
    x: number|null;
    y: number|null;
}