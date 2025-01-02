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

interface BulkMoveNotesPayload {
    noteUuids: string[];
    offset: { x: number, y: number };
}

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
        bulkMoveNotes: (state, action: PayloadAction<BulkMoveNotesPayload>) => {
            action.payload.noteUuids.forEach((noteUuid) => {
                const noteIndex = state.noteItems.findIndex((note) => note.uuid === noteUuid);
                const item = state.noteItems[noteIndex];
                state.noteItems[noteIndex] = {
                    ...item,
                    x: (item.x ?? 0) + action.payload.offset.x,
                    y: (item.y ?? 0) + action.payload.offset.y,
                };
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
    bulkMoveNotes,
    bulkMoveNotesToDrawer,
    bulkDeleteNotes,
} = notesSlice.actions;

export default notesSlice.reducer;
