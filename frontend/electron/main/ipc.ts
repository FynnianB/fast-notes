import handleOverlayIpc from './ipc/overlayIpc';
import handleUserSettingsIpc from './ipc/userPreferencesIpc';
import handleNotesIpc from './ipc/notesIpc';
import handleElectronIpc from './ipc/electronIpc';

export const handleIpc = () => {
    handleElectronIpc();
    handleOverlayIpc();
    handleUserSettingsIpc();
    handleNotesIpc();
}
