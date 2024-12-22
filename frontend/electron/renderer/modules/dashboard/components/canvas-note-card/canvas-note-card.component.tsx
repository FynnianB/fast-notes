import type { KeyboardEvent } from 'react';
import type React from 'react';
import { useEffect, useState } from 'react';
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
import { useAppSelector } from '@common/hooks/store.hooks';
import { useSelectionService } from '@modules/dashboard/services/selection.service';
import type { Note } from '../../../../../@types/notes.type';

interface CanvasNoteCardProps {
    note: Note;
    zoom: number;
    isSelected: boolean;
    onSelectionToggle: (note: Note, selected: boolean) => void;
    onSelectSingle: (note: Note) => void;
}

const CanvasNoteCard = ({
    note,
    zoom,
    isSelected,
    onSelectionToggle,
    onSelectSingle,
}: CanvasNoteCardProps) => {
    const { moveNote, deleteNote, moveNoteToDrawer, updateNoteContent } = useCanvasService();
    const { deleteSelectedNotes, moveSelectedNotesToDrawer } = useSelectionService();
    const selectedNoteIds = useAppSelector((state) => state.notes.selectedNoteIds);
    const [position, setPosition] = useState({ x: note.x ?? 0, y: note.y ?? 0 });
    const [deleteDialogOpened, setDeleteDialogOpened] = useState(false);
    const [editDialogOpened, setEditDialogOpened] = useState(false);

    const isBulkOperation = selectedNoteIds.length > 1 && selectedNoteIds.includes(note.uuid);
    const bulkOperationNoteCount = isBulkOperation ? selectedNoteIds.length : 1;

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

    const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
        if (event.ctrlKey) {
            if (event.button === 0) {
                onSelectionToggle(note, !isSelected);
            } else {
                event.preventDefault();
            }
        } else if (!isSelected) {
            onSelectSingle(note);
        }
    };

    const handleDeleteNote = () => {
        if (isBulkOperation) {
            deleteSelectedNotes();
        } else {
            deleteNote(note);
        }
    };
    const handleMoveToDrawer = () => {
        if (isBulkOperation) {
            moveSelectedNotesToDrawer();
        } else {
            moveNoteToDrawer(note);
        }
    };
    const handleEditNote = (content: string) => updateNoteContent(note, content);

    useEffect(() => {
        setPosition({ x: note.x ?? 0, y: note.y ?? 0 });
    }, [note.x, note.y]);

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
                        style={{ outline: isSelected ? '2px solid var(--accent-8)' : 'none' }}
                        onMouseDown={handleMouseDown}
                    />
                </ContextMenu.Trigger>
                <NoteCardContextMenuContent
                    onSelectEdit={() => setEditDialogOpened(true)}
                    onSelectDelete={() => setDeleteDialogOpened(true)}
                    onSelectMoveToDrawer={handleMoveToDrawer}
                    bulkSelection={isBulkOperation}
                />
            </ContextMenu.Root>
            <NoteDeleteDialog open={deleteDialogOpened} onOpenChange={setDeleteDialogOpened} onSubmit={handleDeleteNote} count={bulkOperationNoteCount} />
            <NoteEditDialog note={note} open={editDialogOpened} onOpenChange={setEditDialogOpened} onSubmit={handleEditNote} />
        </Rnd>
    );
};

export default CanvasNoteCard;
