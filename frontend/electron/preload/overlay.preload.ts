import { contextBridge, ipcRenderer } from 'electron';
import './shared.preload';

contextBridge.exposeInMainWorld('overlayApi', {
    addNote: (content: string) => ipcRenderer.invoke('notes/add-note', content),
    closeOverlay: () => ipcRenderer.invoke('overlay/close'),
    increaseOverlayHeightBy: (height: number) => ipcRenderer.invoke('overlay/increase-height', height),
});
