import { contextBridge, ipcRenderer } from 'electron';
import { UserPreferences } from '../@types/userPreferences.type';
import { Note } from '../@types/notes.type';
import './shared.preload';

contextBridge.exposeInMainWorld('electronApi', {
    // Methods
    getLogsFolderPath: () => ipcRenderer.invoke('electron/getLogsFolderPath'),
    updateUserPreferences: (preferences: UserPreferences) => ipcRenderer.invoke('userPreferences/update', preferences),
    getUserPreferences: () => ipcRenderer.invoke('userPreferences/get'),
    fetchNotes: () => ipcRenderer.invoke('notes/fetch-all'),
    updateNote: (note: Note) => ipcRenderer.invoke('notes/updateNote', note),
    bulkUpdateNotes: (notes: Note[]) => ipcRenderer.invoke('notes/bulkUpdateNotes', notes),
    bulkMoveNotesToDrawer: (noteIds: string[]) => ipcRenderer.invoke('notes/bulkMoveToDrawer', noteIds),
    bulkDeleteNotes: (noteIds: string[]) => ipcRenderer.invoke('notes/bulkDelete', noteIds),
    openOverlay: () => ipcRenderer.invoke('overlay/open'),
    // Listeners
    onUpdateNotes: (callback: (notes: Note[]) => void) => ipcRenderer.on('notes/update', (_event, notes) => callback(notes)),
});
