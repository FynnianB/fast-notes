export type UserPreferences = {
    dashboard: {
        noteDrawerWidth: number;
        noteDrawerExpanded: boolean;
        canvasZoom: number;
        canvasOffset: {
            x: number;
            y: number;
        }
    }
}