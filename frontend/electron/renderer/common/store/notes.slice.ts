import type { PayloadAction } from '@reduxjs/toolkit';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { NotesStore } from '@common/@types/store.types';
import * as notesApi from '@common/api/notes.api';
import type { Note } from '../../../@types/notes.type';

const initialState: NotesStore = {
    noteItems: [],
};

export const fetchNotes = createAsyncThunk(
    'notes/fetch',
    async () => notesApi.fetchNotes(),
);

const notesSlice = createSlice({
    name: 'notes',
    initialState,
    reducers: {
        setNoteItems: (state, action: PayloadAction<Note[]>) => {
            state.noteItems = action.payload.map((note) => ({
                ...note,
                lastModified: note.lastModified.toISOString(),
                createdAt: note.createdAt.toISOString(),
            }));
        },
        updateNote: (state, action: PayloadAction<Note>) => {
            const noteIndex = state.noteItems.findIndex((note) => note.uuid === action.payload.uuid);
            state.noteItems[noteIndex] = {
                ...action.payload,
                lastModified: action.payload.lastModified.toISOString(),
                createdAt: action.payload.createdAt.toISOString(),
            };
        },
        deleteNote: (state, action: PayloadAction<string>) => {
            const noteUuid = action.payload;
            state.noteItems = state.noteItems.filter((note) => note.uuid !== noteUuid);
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchNotes.fulfilled, (state, action) => {
            state.noteItems = action.payload.map((note) => ({
                ...note,
                lastModified: note.lastModified.toISOString(),
                createdAt: note.createdAt.toISOString(),
            }));
        });
    },
});

export const { setNoteItems, updateNote, deleteNote } = notesSlice.actions;

export default notesSlice.reducer;
