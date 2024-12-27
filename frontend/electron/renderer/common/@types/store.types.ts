import type { Heading, Note } from '../../../@types/notes.type';

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

export type StoreSpecificHeading = Omit<Heading, 'lastModified' | 'createdAt'> & {
    lastModified: string;
    createdAt: string;
};

export type StoreSpecificNote = Omit<Note, 'lastModified' | 'createdAt'> & {
    lastModified: string;
    createdAt: string;
};

export type StoreSpecificCanvasObjectTyped = StoreSpecificNote | StoreSpecificHeading;

export type NotesStore = {
    noteItems: StoreSpecificCanvasObjectTyped[];
    selectedNoteIds: string[];
};
