import handleOverlayIpc from './ipc/overlayIpc';
import handleUserSettingsIpc from './ipc/userPreferencesIpc';
import handleNotesIpc from './ipc/notesIpc';

export const handleIpc = () => {
    handleOverlayIpc();
    handleUserSettingsIpc();
    handleNotesIpc();
}