import type { KeyboardEvent } from 'react';
import { useState } from 'react';
import NoteCard from '@modules/dashboard/components/note-card/note-card.component';
import type { DraggableData } from 'react-rnd';
import { Rnd } from 'react-rnd';
import type { DraggableEvent } from 'react-draggable';
import { ContextMenu } from '@radix-ui/themes';
import NoteCardContextMenuContent
    from '@modules/dashboard/components/note-card-context-menu/note-card-context-menu.component';
import NoteDeleteDialog from '@modules/dashboard/components/note-delete-dialog/note-delete-dialog.component';
import { useCanvasService } from '@modules/dashboard/services/canvas.service';
import NoteEditDialog from '@modules/dashboard/components/note-edit-dialog/note-edit-dialog.component';
import type { Note } from '../../../../../@types/notes.type';

interface CanvasNoteCardProps {
    note: Note;
    zoom: number;
}

const CanvasNoteCard = ({
    note,
    zoom,
}: CanvasNoteCardProps) => {
    const { moveNote, deleteNote, moveNoteToDrawer, updateNoteContent } = useCanvasService();
    const [position, setPosition] = useState({ x: note.x ?? 0, y: note.y ?? 0 });
    const [deleteDialogOpened, setDeleteDialogOpened] = useState(false);
    const [editDialogOpened, setEditDialogOpened] = useState(false);

    const handleDragStop = (_event: DraggableEvent, data: DraggableData) => {
        setPosition({ x: data.x, y: data.y });
        moveNote(note, { x: data.x, y: data.y });
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Backspace' || e.key === 'Delete') {
            setDeleteDialogOpened(true);
        } else if (e.key === 'e' && e.ctrlKey) {
            setEditDialogOpened(true);
        }
    };

    const handleDeleteNote = () => deleteNote(note);
    const handleMoveToDrawer = () => moveNoteToDrawer(note);
    const handleEditNote = (content: string) => updateNoteContent(note, content);

    return (
        <Rnd
            position={{ x: position.x, y: position.y }}
            enableResizing={false}
            onDragStop={handleDragStop}
            scale={zoom}
            dragHandleClassName="card-footer"
        >
            <ContextMenu.Root>
                <ContextMenu.Trigger>
                    <NoteCard
                        note={note}
                        tabIndex={0}
                        onKeyDown={handleKeyDown}
                    />
                </ContextMenu.Trigger>
                <NoteCardContextMenuContent
                    onSelectEdit={() => setEditDialogOpened(true)}
                    onSelectDelete={() => setDeleteDialogOpened(true)}
                    onSelectMoveToDrawer={handleMoveToDrawer}
                />
            </ContextMenu.Root>
            <NoteDeleteDialog open={deleteDialogOpened} onOpenChange={setDeleteDialogOpened} onSubmit={handleDeleteNote} />
            <NoteEditDialog note={note} open={editDialogOpened} onOpenChange={setEditDialogOpened} onSubmit={handleEditNote} />
        </Rnd>
    );
};

export default CanvasNoteCard;
