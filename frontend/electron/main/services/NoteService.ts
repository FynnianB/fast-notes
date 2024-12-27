import { NoteRepository } from '../database/repository/NoteRepository';
import { NoteSyncStatus } from '../enumerations/NoteSyncStatus.enumation';
import { invokeUpdateNotesEvent } from '../ipc/notesIpc';
import { CanvasObjectType } from '../enumerations/CanvasObjectType';
import { Note } from '../../@types/notes.type';

class NoteService {
    private noteRepository: NoteRepository;

    constructor() {
        this.noteRepository = new NoteRepository();
    }

    addNote(content: string): void {
        const date = new Date();
        this.noteRepository.insert({
            type: CanvasObjectType.Note,
            content: content,
            lastModified: date,
            createdAt: date,
            category: null,
            syncStatus: NoteSyncStatus.PENDING,
            isDeleted: false,
            x: null,
            y: null,
        });
        invokeUpdateNotesEvent();
        // todo: Syncing logic
        // todo: send notification
    }

    updateNote(model: Note): void {
        this.noteRepository.update(model);
        // todo: Syncing logic
    }

    bulkMoveToDrawer(uuids: string[]): void {
        this.noteRepository.bulkMoveToDrawer(uuids);
    }
}

export default new NoteService();
