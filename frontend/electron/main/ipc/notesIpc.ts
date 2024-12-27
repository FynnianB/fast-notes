import { ipcMain } from 'electron';
import { CanvasObject, CanvasObjectTyped, Heading, Note } from '../../@types/notes.type';
import { invokeMainWindowEvent } from '../window/mainWindowHelper';
import CanvasObjectService from '../services/CanvasObjectService';
import logger from '../services/logger.service';
import NoteService from '../services/NoteService';
import HeadingService from '../services/HeadingService';

const handleIpc = () => {
    ipcMain.handle('notes/fetch-all', async (_event): Promise<CanvasObjectTyped[]> => {
        try {
            return CanvasObjectService.findAllTyped();
        } catch (e: unknown) {
            logger.error('An error occurred while fetching canvas objects', e);
            return [];
        }
    });
    ipcMain.handle('notes/add-note', async (_event, content: string): Promise<boolean> => {
        try {
            NoteService.addNote(content);
            return true;
        } catch (e: unknown) {
            logger.error('Error while adding note', e);
            return false;
        }
    });
    ipcMain.handle('notes/update-note', async (_event, note: Note): Promise<void> => {
        NoteService.updateNote(note);
    });
    ipcMain.handle('notes/add-heading', async (_event, headingData: Pick<Heading, 'text'|'fontSize'|'color'|'x'|'y'>): Promise<void> => {
        HeadingService.addHeading(headingData);
    });
    ipcMain.handle('notes/update-heading', async (_event, heading: Heading): Promise<void> => {
        HeadingService.updateHeading(heading);
    });
    ipcMain.handle('notes/update-canvas-object', async (_event, canvasObject: CanvasObject): Promise<void> => {
        CanvasObjectService.updateCanvasObject(canvasObject);
    });
    ipcMain.handle('notes/delete-canvas-object', async (_event, uuid: string): Promise<void> => {
        CanvasObjectService.softDeleteCanvasObject(uuid);
    });
    ipcMain.handle('notes/bulk-update-canvas-objects', async (_event, canvasObjects: CanvasObject[]): Promise<void> => {
        CanvasObjectService.bulkUpdateCanvasObjects(canvasObjects);
    });
    ipcMain.handle('notes/bulk-move-notes-to-drawer', async (_event, noteIds: string[]): Promise<void> => {
        NoteService.bulkMoveToDrawer(noteIds);
    });
    ipcMain.handle('notes/bulk-delete-canvas-objects', async (_event, canvasObjectIds: string[]): Promise<void> => {
        CanvasObjectService.bulkSoftDeleteCanvasObjects(canvasObjectIds);
    });
}

export const invokeUpdateNotesEvent = () => {
    invokeMainWindowEvent('notes/update', CanvasObjectService.findAllTyped());
}

export default handleIpc;
