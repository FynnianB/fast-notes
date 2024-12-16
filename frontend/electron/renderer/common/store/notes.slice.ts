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

type MoveNotePayload = {
    noteUuid: Note['uuid'];
    position: { x: number; y: number };
};

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
        moveNote: (state, action: PayloadAction<MoveNotePayload>) => {
            const noteIndex = state.noteItems.findIndex((note) => note.uuid === action.payload.noteUuid);
            state.noteItems[noteIndex] = {
                ...state.noteItems[noteIndex],
                x: action.payload.position.x,
                y: action.payload.position.y,
            };
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

export const { setNoteItems, moveNote } = notesSlice.actions;

export default notesSlice.reducer;
