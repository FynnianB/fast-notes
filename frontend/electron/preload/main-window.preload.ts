import { contextBridge, ipcRenderer } from 'electron';
import { UserPreferences } from '../@types/userPreferences.type';
import { CanvasObject, CanvasObjectTyped, Heading, Note } from '../@types/notes.type';
import './shared.preload';

contextBridge.exposeInMainWorld('electronApi', {
    // Methods
    getLogsFolderPath: () => ipcRenderer.invoke('electron/getLogsFolderPath'),
    updateUserPreferences: (preferences: UserPreferences) => ipcRenderer.invoke('userPreferences/update', preferences),
    getUserPreferences: () => ipcRenderer.invoke('userPreferences/get'),
    fetchNotes: (): Promise<CanvasObjectTyped[]> => ipcRenderer.invoke('notes/fetch-all'),
    updateNote: (note: Note) => ipcRenderer.invoke('notes/update-note', note),
    addHeading: (headingData: Pick<Heading, 'text'|'fontSize'|'color'|'x'|'y'>) => ipcRenderer.invoke('notes/add-heading', headingData),
    updateHeading: (heading: Heading) => ipcRenderer.invoke('notes/update-heading', heading),
    updateCanvasObject: (canvasObject: CanvasObject) => ipcRenderer.invoke('notes/update-canvas-object', canvasObject),
    deleteCanvasObject: (uuid: string) => ipcRenderer.invoke('notes/delete-canvas-object', uuid),
    bulkUpdateCanvasObjects: (canvasObjects: CanvasObject[]) => ipcRenderer.invoke('notes/bulk-update-canvas-objects', canvasObjects),
    bulkMoveNotesToDrawer: (noteIds: string[]) => ipcRenderer.invoke('notes/bulk-move-notes-to-drawer', noteIds),
    bulkDeleteCanvasObjects: (canvasObjectIds: string[]) => ipcRenderer.invoke('notes/bulk-delete-canvas-objects', canvasObjectIds),
    openOverlay: () => ipcRenderer.invoke('overlay/open'),
    // Listeners
    onUpdateCanvasObjects: (callback: (canvasObjects: CanvasObjectTyped[]) => void) => ipcRenderer.on('notes/update', (_event, canvasObjects: CanvasObjectTyped[]) => callback(canvasObjects)),
});
