export async function addNote(content: string): Promise<boolean> {
    return window.overlayApi.addNote(content);
}

export async function closeOverlay(): Promise<void> {
    await window.overlayApi.closeOverlay();
}

export async function increaseOverlayHeightBy(height: number): Promise<void> {
    await window.overlayApi.increaseOverlayHeightBy(height);
}
