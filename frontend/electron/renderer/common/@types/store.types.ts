import { Note } from '../../../@types/notes.type';

export type UserPreferencesStore = {
    dashboardNoteDrawerWidth: number;
    dashboardNoteDrawerExpanded: boolean;
}

export type StoreSpecificNote = Omit<Note, 'lastModified' | 'createdAt'> & {
    lastModified: string;
    createdAt: string;
}

export type NotesStore = {
    noteItems: StoreSpecificNote[];
}