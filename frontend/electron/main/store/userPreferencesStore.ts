import Store from 'electron-store';
import { ElectronStoreWithGetSet } from '../../@types/electronStore.type';
import { UserPreferences } from '../../@types/userPreferences.type';

const userPreferencesStore = new Store<UserPreferences>({
    name: 'userPreferences',
    clearInvalidConfig: true,
    defaults: {
        dashboard: {
            noteDrawerWidth: 25,
            noteDrawerExpanded: true,
            canvasZoom: 1,
            canvasOffset: {
                x: 0,
                y: 0
            }
        }
    }
});

export default userPreferencesStore as ElectronStoreWithGetSet<UserPreferences>;