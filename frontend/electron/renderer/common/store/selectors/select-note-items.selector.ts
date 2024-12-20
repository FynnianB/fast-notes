import { createAppSelector } from '../../../store';
import type { Note } from '../../../../@types/notes.type';

export const selectNoteItems = createAppSelector(
    [(state) => state.notes.noteItems],
    (noteItems) => noteItems.map((note): Note => ({
        ...note,
        lastModified: new Date(note.lastModified),
        createdAt: new Date(note.createdAt),
    })),
);

export const selectUnplacedNoteItems = createAppSelector(
    [selectNoteItems],
    (noteItems) => noteItems.filter((note) => note.x === null || Number.isNaN(note.x) || note.y === null || Number.isNaN(note.y)),
);

export const selectPlacedNoteItems = createAppSelector(
    [selectNoteItems],
    (noteItems) => noteItems.filter((note) => note.x !== null && !Number.isNaN(note.x) && note.y !== null && !Number.isNaN(note.y)),
);

const BUFFER = 500;
export const selectVisibleNoteItems = createAppSelector(
    [selectPlacedNoteItems, (state) => state.userPreferences.dashboard.canvasZoom, (state) => state.userPreferences.dashboard.canvasOffset],
    (noteItems, canvasZoom, canvasOffset) => {
        const viewportWidth = window.innerWidth / canvasZoom;
        const viewportHeight = window.innerHeight / canvasZoom;
        const scaledBuffer = BUFFER / canvasZoom;

        const visibleArea = {
            x1: canvasOffset.x - scaledBuffer,
            y1: canvasOffset.y - scaledBuffer,
            x2: canvasOffset.x + viewportWidth + scaledBuffer,
            y2: canvasOffset.y + viewportHeight + scaledBuffer,
        };

        return noteItems.filter((note) => note.x !== null && note.y !== null
            && note.x >= visibleArea.x1
            && note.x <= visibleArea.x2
            && note.y >= visibleArea.y1
            && note.y <= visibleArea.y2);
    },
);
