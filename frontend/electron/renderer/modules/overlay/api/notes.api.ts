export async function addNote(content: string): Promise<boolean> {
    return await window.electronApi.addNote(content);
}

export async function closeOverlay(): Promise<void> {
    await window.electronApi.closeOverlay();
}