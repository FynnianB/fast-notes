import { UserPreferences } from "./@types/userPreferences.type";
import { Note } from "./@types/notes.type";

export interface IOverlayAPI {
    addNote: (content: string) => Promise<boolean>,
    closeOverlay: () => Promise<void>,
    increaseOverlayHeightBy: (height: number) => Promise<void>,
}

export interface IElectronAPI {
    updateUserPreferences: (settings: UserPreferences) => Promise<void>,
    getUserPreferences: () => Promise<UserPreferences>,
    fetchNotes: () => Promise<Note[]>,
    onUpdateNotes: (callback: (notes: Note[]) => void) => void,
    openOverlay: () => Promise<void>
}

declare global {
    interface Window {
        overlayApi: IOverlayAPI,
        electronApi: IElectronAPI
    }
}