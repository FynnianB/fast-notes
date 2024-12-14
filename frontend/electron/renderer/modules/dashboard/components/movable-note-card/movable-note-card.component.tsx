import { Note } from '../../../../../@types/notes.type';
import React, { useState } from 'react';
import NoteCard from '@modules/dashboard/components/note-card/note-card.component';
import { DraggableData, Rnd } from 'react-rnd';
import { DraggableEvent } from 'react-draggable';

interface DraggableNoteCardProps {
    note: Note;
    onDragStop: (event: DraggableEvent, data: DraggableData) => void;
    bounds?: string;
}

const MovableNoteCard = ({
    note,
    onDragStop,
    bounds = '.canvas',
}: DraggableNoteCardProps) => {
    const [position, setPosition] = useState({ x: note.x ?? 0, y: note.y ?? 0 });

    return (
        <Rnd
            position={{ x: position.x, y: position.y }}
            bounds={bounds}
            enableResizing={false}
            onDragStop={(e,d) => {
                setPosition({ x: d.x, y: d.y });
                onDragStop(e, d);
            }}
        >
            <NoteCard note={note} />
        </Rnd>
    );
}

export default MovableNoteCard;