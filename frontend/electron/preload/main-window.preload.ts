import { contextBridge, ipcRenderer } from 'electron';
import { UserPreferences } from '../@types/userPreferences.type';
import { Note } from '../@types/notes.type';

contextBridge.exposeInMainWorld('electronApi', {
    updateUserPreferences: (preferences: UserPreferences) => ipcRenderer.invoke('userPreferences/update', preferences),
    getUserPreferences: () => ipcRenderer.invoke('userPreferences/get'),
    fetchNotes: () => ipcRenderer.invoke('notes/fetch-all'),
    onUpdateNotes: (callback: (notes: Note[]) => void) => ipcRenderer.on('notes/update', (_event, notes) => callback(notes)),
});