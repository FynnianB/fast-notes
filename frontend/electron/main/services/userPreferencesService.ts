import userPreferencesStore from '../store/userPreferencesStore';
import { UserPreferences } from '../../@types/userPreferences.type';

export const storeUserPreferences = (preferences: UserPreferences) => {
    userPreferencesStore.store = preferences;
};

export const getUserPreferences = (): UserPreferences => {
    return userPreferencesStore.store;
};