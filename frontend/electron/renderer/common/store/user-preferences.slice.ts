import { Action, createAsyncThunk, createSlice, Middleware, PayloadAction } from '@reduxjs/toolkit';
import { fetchUserPreferences, updateUserPreferences } from '@common/api/user-preferences.api';
import { UserPreferencesStore } from '@common/@types/store.types';
import debounce from 'lodash.debounce';
import { RootState } from '../../store';

const initialState: UserPreferencesStore = {
    dashboardNoteDrawerWidth: 25,
    dashboardNoteDrawerExpanded: true,
};

export const loadUserPreferences = createAsyncThunk(
    'userPreferences/load',
    async () => {
        const preferences = await fetchUserPreferences();
        return preferences as UserPreferencesStore;
    }
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
}

const userPreferencesSlice = createSlice({
    name: 'userPreferences',
    initialState,
    reducers: {
        setDashboardNoteDrawerWidth(state, action: PayloadAction<number>) {
            state.dashboardNoteDrawerWidth = action.payload;
        },
        setDashboardNoteDrawerExpanded(state, action: PayloadAction<boolean>) {
            state.dashboardNoteDrawerExpanded = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(loadUserPreferences.fulfilled, (_state, action) => {
            return action.payload;
        });
    },
});

export const { setDashboardNoteDrawerWidth, setDashboardNoteDrawerExpanded } = userPreferencesSlice.actions;

export const selectUserPreferences = (state: RootState) => state.userPreferences;

export default userPreferencesSlice.reducer;