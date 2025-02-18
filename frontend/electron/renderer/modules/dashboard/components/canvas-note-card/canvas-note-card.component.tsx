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
import NoteSelectionPortal from '@modules/dashboard/components/note-selection-portal/note-selection-portal.component';
import type { Note } from '../../../../../@types/notes.type';

const isOffsetSignificantEnough = (offset: { x: number; y: number }) => Math.abs(offset.x) > 0.1 || Math.abs(offset.y) > 0.1;

interface CanvasNoteCardProps {
    note: Note;
    zoom: number;
    isSelected: boolean;
    onSelectionToggle: (note: Note, selected: boolean) => void;
    onSelectSingle: (note: Note) => void;
    isDraggingSelection: boolean;
    onDraggingSelectionChange: (isDragging: boolean) => void;
    canvasFrameRef: React.RefObject<HTMLDivElement>;
}

const CanvasNoteCard = ({
    note,
    zoom,
    isSelected,
    onSelectionToggle,
    onSelectSingle,
    isDraggingSelection,
    onDraggingSelectionChange,
    canvasFrameRef,
}: CanvasNoteCardProps) => {
    const { moveCanvasObject, deleteCanvasObject, moveNoteToDrawer, updateNoteContent } = useCanvasService();
    const { deleteSelectedCanvasObjects, moveSelectedNotesToDrawer, moveSelectedCanvasObjects } = useSelectionService();
    const selectedNoteIds = useAppSelector((state) => state.notes.selectedNoteIds);
    const [position, setPosition] = useState({ x: note.x ?? 0, y: note.y ?? 0 });
    const [deleteDialogOpened, setDeleteDialogOpened] = useState(false);
    const [editDialogOpened, setEditDialogOpened] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [draggingStart, setDraggingStart] = useState({ x: 0, y: 0 });
    const [selectionOffset, setSelectionOffset] = useState({ x: 0, y: 0 });

    const isBulkOperation = selectedNoteIds.length > 1 && selectedNoteIds.includes(note.uuid);
    const bulkOperationNoteCount = isBulkOperation ? selectedNoteIds.length : 1;

    const handleDragStart = (_event: DraggableEvent, data: DraggableData) => {
        if (isBulkOperation) {
            setDraggingStart({ x: data.x, y: data.y });
            setSelectionOffset({ x: 0, y: 0 });
            setIsDragging(true);
            onDraggingSelectionChange(true);
        }
    };

    const handleDrag = (_event: DraggableEvent, data: DraggableData) => {
        if (isBulkOperation) {
            setSelectionOffset({ x: data.x - draggingStart.x, y: data.y - draggingStart.y });
        }
    };

    const handleDragStop = (_event: DraggableEvent, data: DraggableData) => {
        if (isBulkOperation) {
            setPosition({ x: data.x, y: data.y });
            if (isOffsetSignificantEnough(selectionOffset)) {
                moveSelectedCanvasObjects(selectionOffset);
            }
            setSelectionOffset({ x: 0, y: 0 });
            setTimeout(() => {
                setIsDragging(false);
                onDraggingSelectionChange(false);
            }, 1);
        } else {
            setPosition({ x: data.x, y: data.y });
            if (note.x && note.y && isOffsetSignificantEnough({ x: data.x - note.x, y: data.y - note.y })) {
                moveCanvasObject(note, { x: data.x, y: data.y });
            }
        }
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
            deleteSelectedCanvasObjects();
        } else {
            deleteCanvasObject(note);
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
        <>
            <Rnd
                position={{ x: position.x, y: position.y }}
                enableResizing={false}
                onDragStart={handleDragStart}
                onDrag={handleDrag}
                onDragStop={handleDragStop}
                scale={zoom}
                dragHandleClassName="card-footer"
                style={{ visibility: isDraggingSelection && isSelected ? 'hidden' : 'visible' }}
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
            {isBulkOperation && isDragging && (
                <NoteSelectionPortal canvasFrameRef={canvasFrameRef} offset={selectionOffset} />
            )}
        </>
    );
};

export default CanvasNoteCard;
