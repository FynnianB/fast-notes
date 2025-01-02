import type { PayloadAction } from '@reduxjs/toolkit';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { NotesStore } from '@common/@types/store.types';
import * as notesApi from '@common/api/notes.api';
import type { CanvasObject, CanvasObjectTyped, Heading, Note } from '../../../@types/notes.type';

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
        setNoteItems: (state, action: PayloadAction<CanvasObjectTyped[]>) => {
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
        addTemporaryHeading: (state, action: PayloadAction<Heading>) => {
            state.noteItems.push({
                ...action.payload,
                lastModified: action.payload.lastModified.toISOString(),
                createdAt: action.payload.createdAt.toISOString(),
            });
        },
        updateHeading: (state, action: PayloadAction<Heading>) => {
            const headingIndex = state.noteItems.findIndex((heading) => heading.uuid === action.payload.uuid);
            state.noteItems[headingIndex] = {
                ...action.payload,
                lastModified: action.payload.lastModified.toISOString(),
                createdAt: action.payload.createdAt.toISOString(),
            };
        },
        updateCanvasObject: (state, action: PayloadAction<CanvasObject>) => {
            const noteIndex = state.noteItems.findIndex((obj) => obj.uuid === action.payload.uuid);
            state.noteItems[noteIndex] = {
                ...state.noteItems[noteIndex],
                ...action.payload,
                lastModified: action.payload.lastModified.toISOString(),
                createdAt: action.payload.createdAt.toISOString(),
            };
        },
        deleteCanvasObject: (state, action: PayloadAction<string>) => {
            const uuid = action.payload;
            state.noteItems = state.noteItems.filter((obj) => obj.uuid !== uuid);
        },
        bulkMoveCanvasObjects: (state, action: PayloadAction<BulkMoveNotesPayload>) => {
            action.payload.noteUuids.forEach((objUuid) => {
                const noteIndex = state.noteItems.findIndex((obj) => obj.uuid === objUuid);
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
        bulkDeleteCanvasObjects: (state, action: PayloadAction<string[]>) => {
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
    addTemporaryHeading,
    updateHeading,
    updateCanvasObject,
    deleteCanvasObject,
    setSelectedNoteIds,
    bulkMoveCanvasObjects,
    bulkMoveNotesToDrawer,
    bulkDeleteCanvasObjects,
} = notesSlice.actions;

export default notesSlice.reducer;
