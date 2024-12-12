export async function addNote(content: string): Promise<boolean> {
    return await window.overlayApi.addNote(content);
}

export async function closeOverlay(): Promise<void> {
    await window.overlayApi.closeOverlay();
}