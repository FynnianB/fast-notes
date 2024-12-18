import { contextBridge, ipcRenderer } from 'electron';
import type { RendererLog } from '../@types/logging.type';

contextBridge.exposeInMainWorld('sharedApi', {
    log: (log: RendererLog) => ipcRenderer.invoke('electron/log', log),
});
