import { Action } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { Dispatch, MiddlewareAPI } from 'redux';
import { Note } from '../../../@types/notes.type';

export type UserPreferencesStore = {
    dashboardNoteDrawerWidth: number;
}

export type NotesStore = {
    noteItems: Note[];
}

export interface AppMiddleware {
    (api: MiddlewareAPI<Dispatch, RootState>): (next: (action: Action) => unknown) => (action: Action) => unknown;
}