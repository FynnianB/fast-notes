import { useAppDispatch, useAppSelector } from '@common/hooks/store.hooks';
import { useCallback } from 'react';
import { bulkDeleteCanvasObjects, setSelectedNoteIds, bulkMoveNotesToDrawer, bulkMoveCanvasObjects } from '@common/store/notes.slice';
import * as notesApi from '@common/api/notes.api';
import { selectSelectedNoteItems } from '@common/store/selectors/select-note-items.selector';
import { CanvasObjectType } from '../../../../main/enumerations/CanvasObjectType';

export const useSelectionService = () => {
    const dispatch = useAppDispatch();
    const selectedNoteIds = useAppSelector((state) => state.notes.selectedNoteIds);
    const selectedNotes = useAppSelector(selectSelectedNoteItems);

    const moveSelectedCanvasObjects = useCallback((offset: { x: number, y: number }) => {
        dispatch(bulkMoveCanvasObjects({ noteUuids: selectedNoteIds, offset }));
        const updatesNotes = selectedNotes.map((note) => ({
                ...note,
                x: (note.x ?? 0) + offset.x,
                y: (note.y ?? 0) + offset.y,
        }));
        notesApi.bulkUpdateCanvasObjects(updatesNotes).then();
    }, [dispatch, selectedNoteIds, selectedNotes]);

    const moveSelectedNotesToDrawer = useCallback(() => {
        const onlyNoteIds = selectedNotes
            .filter((note) => note.type === CanvasObjectType.Note)
            .map((note) => note.uuid);
        dispatch(bulkMoveNotesToDrawer(onlyNoteIds));
        dispatch(setSelectedNoteIds([]));
        notesApi.bulkMoveNotesToDrawer(onlyNoteIds).then();
    }, [dispatch, selectedNotes]);

    const deleteSelectedCanvasObjects = useCallback(() => {
        dispatch(bulkDeleteCanvasObjects(selectedNoteIds));
        dispatch(setSelectedNoteIds([]));
        notesApi.bulkDeleteCanvasObjects(selectedNoteIds).then();
    }, [dispatch, selectedNoteIds]);

    return {
        moveSelectedCanvasObjects,
        moveSelectedNotesToDrawer,
        deleteSelectedCanvasObjects,
    };
};
