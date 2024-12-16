import type { Action, Middleware, PayloadAction } from '@reduxjs/toolkit';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchUserPreferences, updateUserPreferences } from '@common/api/user-preferences.api';
import type { UserPreferencesStore } from '@common/@types/store.types';
import debounce from 'lodash.debounce';
import type { RootState } from '../../store';

const initialState: UserPreferencesStore = {
    dashboard: {
        noteDrawerWidth: 25,
        noteDrawerExpanded: true,
        canvasZoom: 1,
        canvasOffset: {
            x: 0,
            y: 0,
        },
    },
};

export const loadUserPreferences = createAsyncThunk(
    'userPreferences/load',
    async () => {
        const preferences = await fetchUserPreferences();
        return preferences as UserPreferencesStore;
    },
);

const debouncedUpdateUserPreferences = debounce(updateUserPreferences, 1000);

export const userPreferencesMiddleware: Middleware = (storeApi) => (next) => async (untypedAction) => {
    const result = next(untypedAction);
    const action = untypedAction as Action;

    if (action.type.startsWith('userPreferences/') && !action.type.startsWith('userPreferences/load')) {
        const currentPreferences = storeApi.getState().userPreferences;
        await debouncedUpdateUserPreferences(currentPreferences);
    }

    return result;
};

const userPreferencesSlice = createSlice({
    name: 'userPreferences',
    initialState,
    reducers: {
        setDashboardNoteDrawerWidth(state, action: PayloadAction<number>) {
            state.dashboard.noteDrawerWidth = action.payload;
        },
        setDashboardNoteDrawerExpanded(state, action: PayloadAction<boolean>) {
            state.dashboard.noteDrawerExpanded = action.payload;
        },
        setDashboardCanvasZoom(state, action: PayloadAction<number>) {
            state.dashboard.canvasZoom = action.payload;
        },
        setDashboardCanvasOffset(state, action: PayloadAction<{ x: number, y: number }>) {
            state.dashboard.canvasOffset = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(loadUserPreferences.fulfilled, (_state, action) => action.payload);
    },
});

export const {
    setDashboardNoteDrawerWidth,
    setDashboardNoteDrawerExpanded,
    setDashboardCanvasZoom,
    setDashboardCanvasOffset,
} = userPreferencesSlice.actions;

export const selectDashboardUserPreferences = (state: RootState) => state.userPreferences.dashboard;

export default userPreferencesSlice.reducer;
