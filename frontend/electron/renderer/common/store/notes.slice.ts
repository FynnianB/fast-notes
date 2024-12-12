import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NotesStore } from '@common/@types/store.types';
import { RootState } from '../../store';
import * as notesApi from '@common/api/notes.api';
import { Note } from '../../../@types/notes.type';

const initialState: NotesStore = {
    noteItems: [],
};

export const fetchNotes = createAsyncThunk(
    'notes/fetch',
    async () => {
        return notesApi.fetchNotes();
    }
);

const notesSlice = createSlice({
    name: 'notes',
    initialState,
    reducers: {
        setNoteItems: (state, action: PayloadAction<Note[]>) => {
            state.noteItems = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchNotes.fulfilled, (state, action) => {
            state.noteItems = action.payload;
        });
    },
});

export const { setNoteItems } = notesSlice.actions;

export const selectNoteItems = (state: RootState) => state.notes.noteItems;

export default notesSlice.reducer;