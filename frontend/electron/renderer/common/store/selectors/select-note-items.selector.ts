import { createAppSelector } from '../../../store';
import { Note } from '../../../../@types/notes.type';

export const selectNoteItems = createAppSelector(
    [state => state.notes.noteItems],
    noteItems => noteItems.map((note): Note => ({
        ...note,
        lastModified: new Date(note.lastModified),
        createdAt: new Date(note.createdAt),
    }))
);

export const selectUnplacedNoteItems = createAppSelector(
    [selectNoteItems],
    noteItems => noteItems.filter(note => note.x === null || isNaN(note.x) || note.y === null || isNaN(note.y))
);

export const selectPlacedNoteItems = createAppSelector(
    [selectNoteItems],
    noteItems => noteItems.filter(note => note.x !== null && !isNaN(note.x) && note.y !== null && !isNaN(note.y))
);