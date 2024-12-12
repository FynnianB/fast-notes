import { configureStore } from '@reduxjs/toolkit';
import userPreferencesReducer, { userPreferencesMiddleware } from '@common/store/user-preferences.slice';
import notesReducer from '@common/store/notes.slice';
import { createLogger } from 'redux-logger';

const reduxLogger = createLogger({
    diff: true,
    duration: true,
    timestamp: true,
});

const store = configureStore({
    reducer: {
        userPreferences: userPreferencesReducer,
        notes: notesReducer,
    },
    middleware: (getDefaultMiddleware) => {
        const middlewares = getDefaultMiddleware();
        middlewares.concat(userPreferencesMiddleware);
        if (process.env.NODE_ENV === 'development') {
            // Add redux-logger always at the end
            middlewares.concat(reduxLogger);
        }
        return middlewares;
    },
});

export type AppStore = typeof store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;