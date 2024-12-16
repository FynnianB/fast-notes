import { Note } from '../../../../../@types/notes.type';
import React, { useState } from 'react';
import NoteCard from '@modules/dashboard/components/note-card/note-card.component';
import { DraggableData, Rnd } from 'react-rnd';
import { DraggableEvent } from 'react-draggable';
import { moveNote } from '@common/store/notes.slice';
import * as notesApi from '@common/api/notes.api';
import { useAppDispatch } from '@common/hooks/store.hooks';

interface DraggableNoteCardProps {
    note: Note;
    zoom: number;
}

const MovableNoteCard = ({
    note,
    zoom,
}: DraggableNoteCardProps) => {
    const dispatch = useAppDispatch();
    const [position, setPosition] = useState({ x: note.x ?? 0, y: note.y ?? 0 });

    const handleDragStop = (_event: DraggableEvent, data: DraggableData) => {
        setPosition({ x: data.x, y: data.y });
        dispatch(moveNote({
            noteUuid: note.uuid,
            position: {
                x: data.x,
                y: data.y,
            },
        }));
        notesApi.updateNote({
            ...note,
            x: data.x,
            y: data.y,
        }).then();
    };

    return (
        <Rnd
            position={{ x: position.x, y: position.y }}
            enableResizing={false}
            onDragStop={handleDragStop}
            scale={zoom}
        >
            <NoteCard note={note} />
        </Rnd>
    );
}

export default MovableNoteCard;