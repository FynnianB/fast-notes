import { useAppDispatch } from '@common/hooks/store.hooks';
import {
    updateNote as updateNoteThunk,
    updateCanvasObject as updateCanvasObjectThunk,
    deleteCanvasObject as deleteCanvasObjectThunk,
    addTemporaryHeading as addTemporaryHeadingThunk,
    updateHeading as updateHeadingThunk,
    fetchNotes,
} from '@common/store/notes.slice';
import * as notesApi from '@common/api/notes.api';
import { selectDashboardUserPreferences } from '@common/store/user-preferences.slice';
import { useCallback } from 'react';
import { useAppSelectorRef } from '@common/hooks/react.hooks';
import type { CanvasObject, Heading, Note } from '../../../../@types/notes.type';
import { CanvasObjectType } from '../../../../main/enumerations/CanvasObjectType';
import { NoteSyncStatus } from '../../../../main/enumerations/NoteSyncStatus.enumation';

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

    const deleteCanvasObject = useCallback((canvasObject: CanvasObject) => {
        dispatch(deleteCanvasObjectThunk(canvasObject.uuid));
        notesApi.deleteCanvasObject(canvasObject.uuid).then();
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

    const addHeading = useCallback(async (headingData: Pick<Heading, 'text' | 'fontSize' | 'color' | 'x' | 'y'>) => {
        dispatch(addTemporaryHeadingThunk({
            ...headingData,
            uuid: `temp-${Date.now()}`,
            type: CanvasObjectType.Heading,
            lastModified: new Date(),
            createdAt: new Date(),
            category: null,
            syncStatus: NoteSyncStatus.PENDING,
            isDeleted: false,
        }));
        await notesApi.addHeading(headingData);
        dispatch(fetchNotes());
    }, [dispatch]);

    const updateHeading = useCallback((heading: Heading) => {
        dispatch(updateHeadingThunk(heading));
        notesApi.updateHeading(heading).then();
    }, [dispatch]);

    return {
        updateNoteContent,
        moveNoteFromDrawerToCanvas,
        moveCanvasObject,
        deleteCanvasObject,
        moveNoteToDrawer,
        addHeading,
        updateHeading,
    };
};
