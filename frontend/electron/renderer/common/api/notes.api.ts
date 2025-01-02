import { setNoteItems } from '@common/store/notes.slice';
import type { CanvasObject, CanvasObjectTyped, Heading, Note } from '../../../@types/notes.type';
import type { AppStore } from '../../store';

export const fetchNotes = async (): Promise<CanvasObjectTyped[]> => window.electronApi.fetchNotes();

export const updateNote = async (note: Note): Promise<void> => {
    await window.electronApi.updateNote(note);
};

export const addHeading = async (headingData: Pick<Heading, 'text' | 'fontSize' | 'color' | 'x' | 'y'>): Promise<void> => {
    await window.electronApi.addHeading(headingData);
};

export const updateHeading = async (heading: Heading): Promise<void> => {
    await window.electronApi.updateHeading(heading);
};

export const updateCanvasObject = async (canvasObject: CanvasObject): Promise<void> => {
    await window.electronApi.updateCanvasObject(canvasObject);
};

export const deleteCanvasObject = async (uuid: string): Promise<void> => {
    await window.electronApi.deleteCanvasObject(uuid);
};

export const bulkUpdateCanvasObjects = async (canvasObjects: CanvasObject[]): Promise<void> => {
    await window.electronApi.bulkUpdateCanvasObjects(canvasObjects);
};

export const bulkMoveNotesToDrawer = async (noteIds: string[]): Promise<void> => {
    await window.electronApi.bulkMoveNotesToDrawer(noteIds);
};

export const bulkDeleteCanvasObjects = async (canvasObjectIds: string[]): Promise<void> => {
    await window.electronApi.bulkDeleteCanvasObjects(canvasObjectIds);
};

export const openOverlay = async (): Promise<void> => {
    await window.electronApi.openOverlay();
};

export const handleIpc = (store: AppStore) => {
    window.electronApi.onUpdateCanvasObjects((canvasObjects: CanvasObjectTyped[]) => {
        store.dispatch(setNoteItems(canvasObjects));
    });
};
