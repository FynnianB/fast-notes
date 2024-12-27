import type { StoreSpecificHeading, StoreSpecificNote } from '@common/@types/store.types';
import { createAppSelector } from '../../../store';
import type { CanvasObjectTyped, Heading, Note } from '../../../../@types/notes.type';
import { CanvasObjectType } from '../../../../main/enumerations/CanvasObjectType';

export const selectNoteItems = createAppSelector(
    [(state) => state.notes.noteItems],
    (noteItems) => noteItems.map((item): CanvasObjectTyped => {
        const commonFields = {
            ...item,
            lastModified: new Date(item.lastModified),
            createdAt: new Date(item.createdAt),
        };

        if (item.type === CanvasObjectType.Note) {
            const note = item as StoreSpecificNote;
            return {
                ...commonFields,
                content: note.content,
            } as Note;
        }
        if (item.type === CanvasObjectType.Heading) {
            const heading = item as StoreSpecificHeading;
            return {
                ...commonFields,
                text: heading.text,
                fontSize: heading.fontSize,
                color: heading.color,
            } as Heading;
        }

        throw new Error(`Unknown type: ${item.type}`);
    }),
);

export const selectUnplacedNoteItems = createAppSelector(
    [selectNoteItems],
    (noteItems) => noteItems.filter((note) => note.type === CanvasObjectType.Note
        && (note.x === null || Number.isNaN(note.x) || note.y === null || Number.isNaN(note.y))) as Note[],
);

export const selectPlacedNoteItems = createAppSelector(
    [selectNoteItems],
    (noteItems) => noteItems.filter((note) => note.x !== null && !Number.isNaN(note.x) && note.y !== null && !Number.isNaN(note.y)),
);

const BUFFER = 1000;
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

export const selectSelectedNoteItems = createAppSelector(
    [selectPlacedNoteItems, (state) => state.notes.selectedNoteIds],
    (noteItems, selectedNoteIds) => noteItems.filter((note) => selectedNoteIds.includes(note.uuid)),
);
