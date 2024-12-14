import { Box } from '@radix-ui/themes';
import { selectPlacedNoteItems } from '@common/store/selectors/select-note-items.selector';
import { useAppDispatch, useAppSelector } from '@common/hooks/store.hooks';
import MovableNoteCard from '@modules/dashboard/components/movable-note-card/movable-note-card.component';
import { moveNote } from '@common/store/notes.slice';
import { Note } from '../../../../../@types/notes.type';
import { DraggableEvent } from 'react-draggable';
import { DraggableData } from 'react-rnd';
import * as notesApi from '@common/api/notes.api';

const Canvas = () => {
    const dispatch = useAppDispatch();
    const notes = useAppSelector(selectPlacedNoteItems);

    const handleDragStop = async (note: Note, _event: DraggableEvent, data: DraggableData) => {
        dispatch(moveNote({
            noteUuid: note.uuid,
            position: {
                x: data.x,
                y: data.y,
            },
        }));
        await notesApi.updateNote({
            ...note,
            x: data.x,
            y: data.y,
        })
    };

    return (
        <Box
            style={{
                width: '100%',
                height: '100%',
                position: 'relative',
            }}
            className="canvas"
        >
            {notes.map(note => (
                <MovableNoteCard
                    note={note}
                    key={note.uuid}
                    bounds=".canvas"
                    onDragStop={(e, d) => handleDragStop(note, e, d)}
                />
            ))}
        </Box>
    )
};

export default Canvas;