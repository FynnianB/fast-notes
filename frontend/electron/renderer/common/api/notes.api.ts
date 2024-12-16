import { setNoteItems } from '@common/store/notes.slice';
import type { Note } from '../../../@types/notes.type';
import type { AppStore } from '../../store';

export const fetchNotes = async (): Promise<Note[]> => window.electronApi.fetchNotes();

export const updateNote = async (note: Note): Promise<void> => {
    await window.electronApi.updateNote(note);
};

export const openOverlay = async (): Promise<void> => {
    await window.electronApi.openOverlay();
};

export const handleIpc = (store: AppStore) => {
    window.electronApi.onUpdateNotes((notes: Note[]) => {
        store.dispatch(setNoteItems(notes));
    });
};
