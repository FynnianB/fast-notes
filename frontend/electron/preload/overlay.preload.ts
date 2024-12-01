import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronApi', {
    addNote: (content: string) => ipcRenderer.invoke('add-note', content),
    closeOverlay: () => ipcRenderer.invoke('close-overlay')
});