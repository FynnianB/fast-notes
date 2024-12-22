import { useAppDispatch, useAppSelector } from '@common/hooks/store.hooks';
import { useCallback } from 'react';
import { bulkDeleteNotes, setSelectedNoteIds, bulkMoveNotesToDrawer } from '@common/store/notes.slice';
import * as notesApi from '@common/api/notes.api';

export const useSelectionService = () => {
    const dispatch = useAppDispatch();
    const selectedNoteIds = useAppSelector((state) => state.notes.selectedNoteIds);

    const deleteSelectedNotes = useCallback(() => {
        dispatch(bulkDeleteNotes(selectedNoteIds));
        dispatch(setSelectedNoteIds([]));
        notesApi.bulkDeleteNotes(selectedNoteIds).then();
    }, [dispatch, selectedNoteIds]);

    const moveSelectedNotesToDrawer = useCallback(() => {
        dispatch(bulkMoveNotesToDrawer(selectedNoteIds));
        dispatch(setSelectedNoteIds([]));
        notesApi.bulkMoveNotesToDrawer(selectedNoteIds).then();
    }, [dispatch, selectedNoteIds]);

    return {
        deleteSelectedNotes,
        moveSelectedNotesToDrawer,
    };
};
