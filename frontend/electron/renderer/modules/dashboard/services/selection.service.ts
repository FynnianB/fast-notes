import { useAppDispatch, useAppSelector } from '@common/hooks/store.hooks';
import { useCallback } from 'react';
import { bulkDeleteNotes, setSelectedNoteIds, bulkMoveNotesToDrawer, bulkMoveNotes } from '@common/store/notes.slice';
import * as notesApi from '@common/api/notes.api';
import { selectSelectedNoteItems } from '@common/store/selectors/select-note-items.selector';

export const useSelectionService = () => {
    const dispatch = useAppDispatch();
    const selectedNoteIds = useAppSelector((state) => state.notes.selectedNoteIds);
    const selectedNotes = useAppSelector(selectSelectedNoteItems);

    const moveSelectedNotes = useCallback((offset: { x: number, y: number }) => {
        dispatch(bulkMoveNotes({ noteUuids: selectedNoteIds, offset }));
        const updatesNotes = selectedNotes.map((note) => ({
                ...note,
                x: (note.x ?? 0) + offset.x,
                y: (note.y ?? 0) + offset.y,
        }));
        notesApi.bulkUpdateNotes(updatesNotes).then();
    }, [dispatch, selectedNoteIds, selectedNotes]);

    const moveSelectedNotesToDrawer = useCallback(() => {
        dispatch(bulkMoveNotesToDrawer(selectedNoteIds));
        dispatch(setSelectedNoteIds([]));
        notesApi.bulkMoveNotesToDrawer(selectedNoteIds).then();
    }, [dispatch, selectedNoteIds]);

    const deleteSelectedNotes = useCallback(() => {
        dispatch(bulkDeleteNotes(selectedNoteIds));
        dispatch(setSelectedNoteIds([]));
        notesApi.bulkDeleteNotes(selectedNoteIds).then();
    }, [dispatch, selectedNoteIds]);

    return {
        moveSelectedNotes,
        moveSelectedNotesToDrawer,
        deleteSelectedNotes,
    };
};
