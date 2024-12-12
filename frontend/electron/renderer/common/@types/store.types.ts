import { Note } from '../../../@types/notes.type';

export type UserPreferencesStore = {
    dashboardNoteDrawerWidth: number;
    dashboardNoteDrawerExpanded: boolean;
}

export type NotesStore = {
    noteItems: Note[];
}