import { Note } from '../../../@types/notes.type';
import { setNoteItems } from '@common/store/notes.slice';
import { AppStore } from '../../store';

export const fetchNotes = async (): Promise<Note[]> => {
    return await window.electronApi.fetchNotes();
};

export const openOverlay = async (): Promise<void> => {
    await window.electronApi.openOverlay();
}

export const handleIpc = (store: AppStore) => {
    window.electronApi.onUpdateNotes((notes: Note[]) => {
        store.dispatch(setNoteItems(notes));
    });
}
