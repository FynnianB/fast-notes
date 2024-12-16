import type { UserPreferences } from '../../../@types/userPreferences.type';

export async function updateUserPreferences(preferences: UserPreferences) {
    return window.electronApi.updateUserPreferences(preferences);
}

export async function fetchUserPreferences(): Promise<UserPreferences> {
    return window.electronApi.getUserPreferences();
}
