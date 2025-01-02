import { setNoteItems } from '@common/store/notes.slice';
import type { Note } from '../../../@types/notes.type';
import type { AppStore } from '../../store';

export const fetchNotes = async (): Promise<Note[]> => window.electronApi.fetchNotes();

export const updateNote = async (note: Note): Promise<void> => {
    await window.electronApi.updateNote(note);
};

export const bulkUpdateNotes = async (notes: Note[]): Promise<void> => {
    await window.electronApi.bulkUpdateNotes(notes);
};

export const bulkMoveNotesToDrawer = async (noteIds: string[]): Promise<void> => {
    await window.electronApi.bulkMoveNotesToDrawer(noteIds);
};

export const bulkDeleteNotes = async (noteIds: string[]): Promise<void> => {
    await window.electronApi.bulkDeleteNotes(noteIds);
};

export const openOverlay = async (): Promise<void> => {
    await window.electronApi.openOverlay();
};

export const handleIpc = (store: AppStore) => {
    window.electronApi.onUpdateNotes((notes: Note[]) => {
        store.dispatch(setNoteItems(notes));
    });
};
