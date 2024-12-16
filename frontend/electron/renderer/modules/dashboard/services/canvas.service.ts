import { Note } from '../../../../@types/notes.type';
import { useAppDispatch } from '@common/hooks/store.hooks';
import { moveNote as moveNoteThunk} from '@common/store/notes.slice';
import * as notesApi from '@common/api/notes.api';
import { selectDashboardUserPreferences } from '@common/store/user-preferences.slice';
import { useCallback } from 'react';
import { useAppSelectorRef } from '@common/hooks/react.hooks';

export const useCanvasService = () => {
    const dispatch = useAppDispatch();
    const [_, userPreferencesRef] = useAppSelectorRef(selectDashboardUserPreferences);

    const moveNote = useCallback((note: Note, position: { x: number, y: number}) => {
        // Convert coords relative to the canvas considering the zoom level and offset
        const x = (position.x - userPreferencesRef.current.canvasOffset.x) / userPreferencesRef.current.canvasZoom;
        const y = (position.y - userPreferencesRef.current.canvasOffset.y) / userPreferencesRef.current.canvasZoom;

        dispatch(moveNoteThunk({
            noteUuid: note.uuid,
            position: {
                x: x,
                y: y,
            },
        }));
        notesApi.updateNote({
            ...note,
            x: x,
            y: y,
        }).then();
    }, [dispatch, userPreferencesRef]);

    return {
        moveNote,
    }
}