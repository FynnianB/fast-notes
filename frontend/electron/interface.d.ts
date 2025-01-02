import { UserPreferences } from "./@types/userPreferences.type";
import { CanvasObject, CanvasObjectTyped, Heading, Note } from "./@types/notes.type";
import { RendererLog } from "./@types/logging.type";

export interface IOverlayAPI {
    addNote: (content: string) => Promise<boolean>,
    closeOverlay: () => Promise<void>,
    increaseOverlayHeightBy: (height: number) => Promise<void>,
}

export interface IElectronAPI {
    updateUserPreferences: (settings: UserPreferences) => Promise<void>,
    getUserPreferences: () => Promise<UserPreferences>,
    fetchNotes: () => Promise<CanvasObjectTyped[]>,
    updateNote: (note: Note) => Promise<void>,
    addHeading: (headingData: Pick<Heading, 'text'|'fontSize'|'color'|'x'|'y'>) => Promise<void>,
    updateHeading: (heading: Heading) => Promise<void>,
    updateCanvasObject: (canvasObject: CanvasObject) => Promise<void>,
    deleteCanvasObject: (uuid: string) => Promise<void>,
    bulkUpdateCanvasObjects: (canvasObjects: CanvasObject[]) => Promise<void>,
    bulkMoveNotesToDrawer: (noteIds: string[]) => Promise<void>,
    bulkDeleteCanvasObjects: (canvasObjectIds: string[]) => Promise<void>,
    openOverlay: () => Promise<void>,
    onUpdateCanvasObjects: (callback: (canvasObjects: CanvasObjectTyped[]) => void) => void,
}

export interface ISharedAPI {
    log: (log: RendererLog) => Promise<void>,
}

declare global {
    interface Window {
        overlayApi: IOverlayAPI,
        electronApi: IElectronAPI,
        sharedApi: ISharedAPI,
    }
}
