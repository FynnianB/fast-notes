import { useAppDispatch } from '@common/hooks/store.hooks';
import {
    updateNote as updateNoteThunk,
    updateCanvasObject as updateCanvasObjectThunk,
    deleteCanvasObject as deleteCanvasObjectThunk,
} from '@common/store/notes.slice';
import * as notesApi from '@common/api/notes.api';
import { selectDashboardUserPreferences } from '@common/store/user-preferences.slice';
import { useCallback } from 'react';
import { useAppSelectorRef } from '@common/hooks/react.hooks';
import type { CanvasObject, Note } from '../../../../@types/notes.type';

export const useCanvasService = () => {
    const dispatch = useAppDispatch();
    const [, userPreferencesRef] = useAppSelectorRef(selectDashboardUserPreferences);

    const updateNoteContent = useCallback((note: Note, content: string) => {
        if (note.content === content) return;
        const updatedNote = {
            ...note,
            content: content,
        };
        dispatch(updateNoteThunk(updatedNote));
        notesApi.updateNote(updatedNote).then();
    }, [dispatch]);

    const moveNoteFromDrawerToCanvas = useCallback((note: Note, position: { x: number, y: number }) => {
        // Convert coords relative to the canvas considering the zoom level and offset
        const x = (position.x - userPreferencesRef.current.canvasOffset.x) / userPreferencesRef.current.canvasZoom;
        const y = (position.y - userPreferencesRef.current.canvasOffset.y) / userPreferencesRef.current.canvasZoom;

        const updatedNote = {
            ...note,
            x: x,
            y: y,
        };
        dispatch(updateNoteThunk(updatedNote));
        notesApi.updateNote(updatedNote).then();
    }, [dispatch, userPreferencesRef]);

    const moveCanvasObject = useCallback((canvasObject: CanvasObject, position: { x: number, y: number }) => {
        const updatedCanvasObject = {
            ...canvasObject,
            x: position.x,
            y: position.y,
        };
        dispatch(updateCanvasObjectThunk(updatedCanvasObject));
        notesApi.updateCanvasObject(updatedCanvasObject).then();
    }, [dispatch]);

    const deleteCanvasObject = useCallback((note: Note) => {
        dispatch(deleteCanvasObjectThunk(note.uuid));
        notesApi.deleteCanvasObject(note.uuid).then();
    }, [dispatch]);

    const moveNoteToDrawer = useCallback((note: Note) => {
        const updatedNote = {
            ...note,
            x: null,
            y: null,
        };
        dispatch(updateNoteThunk(updatedNote));
        notesApi.updateNote(updatedNote).then();
    }, [dispatch]);

    return {
        moveNoteFromDrawerToCanvas,
        moveCanvasObject,
        deleteCanvasObject,
        moveNoteToDrawer,
        updateNoteContent,
    };
};
