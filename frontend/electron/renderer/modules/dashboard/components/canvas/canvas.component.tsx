import { Box } from '@radix-ui/themes';
import { selectVisibleNoteItems } from '@common/store/selectors/select-note-items.selector';
import { useAppDispatch, useAppSelector } from '@common/hooks/store.hooks';
import CanvasNoteCard from '@modules/dashboard/components/canvas-note-card/canvas-note-card.component';
import type React from 'react';
import { useRef, useState } from 'react';
import {
    selectDashboardUserPreferences,
    setDashboardCanvasOffset,
    setDashboardCanvasZoom,
} from '@common/store/user-preferences.slice';
import debounce from 'lodash.debounce';
import { setSelectedNoteIds } from '@common/store/notes.slice';
import { useSelectionService } from '@modules/dashboard/services/selection.service';
import NoteDeleteDialog from '@modules/dashboard/components/note-delete-dialog/note-delete-dialog.component';
import store from '../../../../store';
import type { Note } from '../../../../../@types/notes.type';

const debouncedHandlePanning = debounce((newOffset) => {
    store.dispatch(setDashboardCanvasOffset(newOffset));
}, 50);

const debouncedHandleZooming = debounce((newOffset, newZoom) => {
    store.dispatch(setDashboardCanvasOffset(newOffset));
    store.dispatch(setDashboardCanvasZoom(newZoom));
}, 50);

const Canvas = () => {
    const dispatch = useAppDispatch();
    const { deleteSelectedNotes } = useSelectionService();
    const notes = useAppSelector(selectVisibleNoteItems);
    const selectedNoteIds = useAppSelector((state) => state.notes.selectedNoteIds);
    const { canvasZoom, canvasOffset } = useAppSelector(selectDashboardUserPreferences);
    const [zoom, setZoom] = useState(canvasZoom);
    const [offset, setOffset] = useState(canvasOffset);
    const [isPanning, setIsPanning] = useState(false);
    const startOffset = useRef({ x: 0, y: 0 });
    const startMouse = useRef({ x: 0, y: 0 });
    const canvasRef = useRef<HTMLDivElement>(null);
    const [selectionBox, setSelectionBox] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
    const [deleteDialogOpened, setDeleteDialogOpened] = useState(false);

    const zoomCanvas = (mouseX: number, mouseY: number, zoomDelta: number) => {
        const mouseCanvasX = (mouseX - offset.x) / zoom;
        const mouseCanvasY = (mouseY - offset.y) / zoom;

        const newZoom = Math.min(1.25, Math.max(0.3, zoom * zoomDelta));
        if (newZoom === zoom) return;

        const newOffset = {
            x: offset.x - (mouseCanvasX * newZoom - mouseCanvasX * zoom),
            y: offset.y - (mouseCanvasY * newZoom - mouseCanvasY * zoom),
        };
        setOffset(newOffset);
        setZoom(newZoom);
        debouncedHandleZooming(newOffset, newZoom);
    };

    const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
        // Ensure the event only fires if the cursor is directly over the background
        if (event.target !== event.currentTarget) {
            return;
        }
        // Only allow zooming while not selecting
        if (selectionBox) return;

        const zoomDelta = 1 + (event.deltaY * -0.002);
        zoomCanvas(event.nativeEvent.offsetX, event.nativeEvent.offsetY, zoomDelta);
    };

    const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
        if (event.target !== event.currentTarget) {
            return;
        }
        if (event.button === 1) {
            setIsPanning(true);
            startMouse.current = { x: event.clientX, y: event.clientY };
            startOffset.current = offset;
            return;
        }
        if (event.button === 0 && !event.ctrlKey) {
            event.preventDefault();
            canvasRef.current?.focus();
            if (!event.shiftKey) {
                dispatch(setSelectedNoteIds([]));
            }
            setSelectionBox({
                x: event.clientX - (canvasRef.current?.getBoundingClientRect().x ?? 0),
                y: event.clientY - (canvasRef.current?.getBoundingClientRect().y ?? 0),
                width: 0,
                height: 0,
            });
        }
    };

    const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
        if (isPanning) {
            const dx = event.clientX - startMouse.current.x;
            const dy = event.clientY - startMouse.current.y;
            const newOffset = {
                x: startOffset.current.x + dx,
                y: startOffset.current.y + dy,
            };
            setOffset(newOffset);
            debouncedHandlePanning(newOffset);
            return;
        }
        if (selectionBox) {
            const newBox = {
                x: selectionBox.x,
                y: selectionBox.y,
                width: (event.clientX - (canvasRef.current?.getBoundingClientRect().x ?? 0)) - selectionBox.x,
                height: (event.clientY - (canvasRef.current?.getBoundingClientRect().y ?? 0)) - selectionBox.y,
            };
            setSelectionBox(newBox);
        }
    };

    const handleMouseUp = () => {
        if (isPanning) {
            setIsPanning(false);
            return;
        }
        if (selectionBox) {
            const selectedIds = notes
                .filter((note) => {
                    if (note.x === null || note.y === null) return false;

                    // Handling negative width and height
                    const normalizedSelectionBox = {
                        x: Math.min(selectionBox.x, selectionBox.x + selectionBox.width),
                        y: Math.min(selectionBox.y, selectionBox.y + selectionBox.height),
                        width: Math.abs(selectionBox.width),
                        height: Math.abs(selectionBox.height),
                    };
                    // Convert selection box to canvas space
                    const selectionCanvas = {
                        x: (normalizedSelectionBox.x - offset.x) / zoom,
                        y: (normalizedSelectionBox.y - offset.y) / zoom,
                        width: normalizedSelectionBox.width / zoom,
                        height: normalizedSelectionBox.height / zoom,
                    };

                    return (
                        note.x > selectionCanvas.x
                        && note.x < selectionCanvas.x + selectionCanvas.width
                        && note.y > selectionCanvas.y
                        && note.y < selectionCanvas.y + selectionCanvas.height
                    );
                })
                .map((note) => note.uuid);
            const updatedIds = Array.from(new Set([...selectedNoteIds, ...selectedIds]));
            dispatch(setSelectedNoteIds(updatedIds));
            setSelectionBox(null);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (document.activeElement !== canvasRef.current) return;

        if (e.key === '+' && e.ctrlKey) {
            e.preventDefault();
            zoomCanvas(window.innerWidth / 2, window.innerHeight / 2, 1.2);
        } else if (e.key === '-' && e.ctrlKey) {
            e.preventDefault();
            zoomCanvas(window.innerWidth / 2, window.innerHeight / 2, 0.8);
        } else if (e.key === 'Delete' || e.key === 'Backspace') {
            e.preventDefault();
            setDeleteDialogOpened(true);
        }
    };

    const handleSelectionToggle = (note: Note, selected: boolean) => {
        if (selected) {
            dispatch(setSelectedNoteIds([...selectedNoteIds, note.uuid]));
        } else {
            dispatch(setSelectedNoteIds(selectedNoteIds.filter((id) => id !== note.uuid)));
        }
    };

    const handleSelectSingle = (note: Note) => {
        dispatch(setSelectedNoteIds([note.uuid]));
    };

    return (
        <div
            ref={canvasRef}
            style={{
                minWidth: '100%',
                minHeight: '100%',
                position: 'relative',
                overflow: 'hidden',
                cursor: isPanning ? 'grabbing' : 'default',
                outline: 'none',
            }}
            id="dashboard-canvas"
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onKeyDown={handleKeyDown}
            role="button"
            tabIndex={0}
        >
            <Box
                id="canvas-frame"
                className="canvas-frame"
                style={{
                    transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
                    transformOrigin: '0 0',
                    position: 'relative',
                }}
            >
                {notes.map((note) => (
                    <CanvasNoteCard
                        note={note}
                        key={note.uuid}
                        zoom={zoom}
                        isSelected={selectedNoteIds.includes(note.uuid)}
                        onSelectionToggle={handleSelectionToggle}
                        onSelectSingle={handleSelectSingle}
                    />
                ))}
                {selectionBox && (
                    <div
                        style={{
                            position: 'absolute',
                            left: (Math.min(selectionBox.x, selectionBox.x + selectionBox.width) - offset.x) / zoom,
                            top: (Math.min(selectionBox.y, selectionBox.y + selectionBox.height) - offset.y) / zoom,
                            width: Math.abs(selectionBox.width) / zoom,
                            height: Math.abs(selectionBox.height) / zoom,
                            backgroundColor: 'var(--accent-a2)',
                            border: '2px solid var(--accent-a8)',
                            pointerEvents: 'none',
                        }}
                    />
                )}
            </Box>
            <NoteDeleteDialog open={deleteDialogOpened} onOpenChange={setDeleteDialogOpened} onSubmit={deleteSelectedNotes} count={selectedNoteIds.length} />
        </div>
    );
};

export default Canvas;
