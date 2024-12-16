import { configureStore, createSelector } from '@reduxjs/toolkit';
import userPreferencesReducer, { userPreferencesMiddleware } from '@common/store/user-preferences.slice';
import notesReducer from '@common/store/notes.slice';

const store = configureStore({
    reducer: {
        userPreferences: userPreferencesReducer,
        notes: notesReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false })
                .concat(userPreferencesMiddleware),
});

export const createAppSelector = createSelector.withTypes<RootState>();

export type AppStore = typeof store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
