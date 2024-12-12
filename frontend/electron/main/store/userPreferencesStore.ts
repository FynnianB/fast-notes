import Store from 'electron-store';
import { ElectronStoreWithGetSet } from '../../@types/electronStore.type';
import { UserPreferences } from '../../@types/userPreferences.type';

const userPreferencesStore = new Store<UserPreferences>({
    name: 'userPreferences',
    defaults: {
        dashboardNoteDrawerWidth: 25,
        dashboardNoteDrawerExpanded: true
    }
});

export default userPreferencesStore as ElectronStoreWithGetSet<UserPreferences>;