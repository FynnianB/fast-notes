export interface IElectronAPI {
    addNote: (content: string) => Promise<boolean>,
    closeOverlay: () => Promise<void>
}

declare global {
    interface Window {
        electronApi: IElectronAPI
    }
}