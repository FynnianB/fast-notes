import { UserPreferences } from '../../../@types/userPreferences.type';

export async function updateUserPreferences(preferences: UserPreferences) {
    return await window.electronApi.updateUserPreferences(preferences);
}

export async function fetchUserPreferences(): Promise<UserPreferences> {
    return await window.electronApi.getUserPreferences();
}