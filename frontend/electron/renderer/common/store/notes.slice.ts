import type { PayloadAction } from '@reduxjs/toolkit';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { NotesStore } from '@common/@types/store.types';
import * as notesApi from '@common/api/notes.api';
import type { Note } from '../../../@types/notes.type';

const initialState: NotesStore = {
    noteItems: [],
    selectedNoteIds: [],
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
        bulkUpdateNotes: (state, action: PayloadAction<Note[]>) => {
            state.noteItems = state.noteItems.map((note) => {
                const updatedNote = action.payload.find((n) => n.uuid === note.uuid);
                if (updatedNote) {
                    return {
                        ...updatedNote,
                        lastModified: updatedNote.lastModified.toISOString(),
                        createdAt: updatedNote.createdAt.toISOString(),
                    };
                }
                return note;
            });
        },
        bulkMoveNotesToDrawer: (state, action: PayloadAction<string[]>) => {
            state.noteItems = state.noteItems.map((note) => {
                if (action.payload.includes(note.uuid)) {
                    return {
                        ...note,
                        x: null,
                        y: null,
                    };
                }
                return note;
            });
        },
        bulkDeleteNotes: (state, action: PayloadAction<string[]>) => {
            state.noteItems = state.noteItems.filter((note) => !action.payload.includes(note.uuid));
        },
        setSelectedNoteIds: (state, action: PayloadAction<string[]>) => {
            state.selectedNoteIds = action.payload;
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

export const {
    setNoteItems,
    updateNote,
    deleteNote,
    setSelectedNoteIds,
    bulkUpdateNotes,
    bulkMoveNotesToDrawer,
    bulkDeleteNotes,
} = notesSlice.actions;

export default notesSlice.reducer;
