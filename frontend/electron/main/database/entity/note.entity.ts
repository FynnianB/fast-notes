import { NoteSyncStatus } from '../../enumerations/NoteSyncStatus.enumation';

export interface Note {
    uuid: string;
    content: string;
    last_modified: Date;
    category_id: string|null;
    sync_status: NoteSyncStatus;
    is_deleted: boolean;
}