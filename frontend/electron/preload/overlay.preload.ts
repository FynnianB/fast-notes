import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('overlayApi', {
    addNote: (content: string) => ipcRenderer.invoke('overlay/add-note', content),
    closeOverlay: () => ipcRenderer.invoke('overlay/close'),
    increaseOverlayHeightBy: (height: number) => ipcRenderer.invoke('overlay/increase-height', height),
});