import type { Note } from '../../../@types/notes.type';

export type UserPreferencesStore = {
    dashboard: {
        noteDrawerWidth: number;
        noteDrawerExpanded: boolean;
        canvasZoom: number;
        canvasOffset: {
            x: number;
            y: number;
        }
    }
};

export type StoreSpecificNote = Omit<Note, 'lastModified' | 'createdAt'> & {
    lastModified: string;
    createdAt: string;
};

export type NotesStore = {
    noteItems: StoreSpecificNote[];
    selectedNoteIds: string[];
};
