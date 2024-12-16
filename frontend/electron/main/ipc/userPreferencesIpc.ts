import { ipcMain } from 'electron';
import { UserPreferences } from '../../@types/userPreferences.type';
import { getUserPreferences, storeUserPreferences } from '../services/userPreferencesService';

const handleIpc = () => {
    ipcMain.handle('userPreferences/update', async (_event, preferences: UserPreferences): Promise<void> => {
        storeUserPreferences(preferences);
    });
    ipcMain.handle('userPreferences/get', async (_event): Promise<UserPreferences> => {
        return getUserPreferences();
    });
}

export default handleIpc;