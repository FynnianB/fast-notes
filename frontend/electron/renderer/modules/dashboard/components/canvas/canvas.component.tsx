import { Box } from '@radix-ui/themes';
import { selectPlacedNoteItems } from '@common/store/selectors/select-note-items.selector';
import { useAppDispatch, useAppSelector } from '@common/hooks/store.hooks';
import MovableNoteCard from '@modules/dashboard/components/movable-note-card/movable-note-card.component';
import type React from 'react';
import { useRef, useState } from 'react';
import {
    selectDashboardUserPreferences,
    setDashboardCanvasOffset,
    setDashboardCanvasZoom,
} from '@common/store/user-preferences.slice';

const Canvas = () => {
    const dispatch = useAppDispatch();
    const notes = useAppSelector(selectPlacedNoteItems);
    const { canvasZoom, canvasOffset } = useAppSelector(selectDashboardUserPreferences);
    const [zoom, setZoom] = useState(canvasZoom);
    const [offset, setOffset] = useState(canvasOffset);
    const [isPanning, setIsPanning] = useState(false);
    const startOffset = useRef({ x: 0, y: 0 });
    const startMouse = useRef({ x: 0, y: 0 });

    const zoomCanvas = (mouseX: number, mouseY: number, zoomDelta: number) => {
        const mouseCanvasX = (mouseX - offset.x) / zoom;
        const mouseCanvasY = (mouseY - offset.y) / zoom;

        const newZoom = Math.min(2, Math.max(0.3, zoom * zoomDelta));
        if (newZoom === zoom) return;

        const newOffset = {
            x: offset.x - (mouseCanvasX * newZoom - mouseCanvasX * zoom),
            y: offset.y - (mouseCanvasY * newZoom - mouseCanvasY * zoom),
        };
        setOffset(newOffset);
        setZoom(newZoom);
        dispatch(setDashboardCanvasOffset(newOffset));
        dispatch(setDashboardCanvasZoom(newZoom));
    };

    const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
        const zoomDelta = 1 + (event.deltaY * -0.001);
        zoomCanvas(event.nativeEvent.offsetX, event.nativeEvent.offsetY, zoomDelta);
    };

    const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
        if (event.button === 1) {
            setIsPanning(true);
            startMouse.current = { x: event.clientX, y: event.clientY };
            startOffset.current = offset;
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
            dispatch(setDashboardCanvasOffset(newOffset));
        }
    };

    const handleMouseUp = () => {
        setIsPanning(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === '+' && e.ctrlKey) {
            e.preventDefault();
            zoomCanvas(window.innerWidth / 2, window.innerHeight / 2, 1.2);
        } else if (e.key === '-' && e.ctrlKey) {
            e.preventDefault();
            zoomCanvas(window.innerWidth / 2, window.innerHeight / 2, 0.8);
        }
    };

    return (
        <div
            style={{
                minWidth: '100%',
                minHeight: '100%',
                position: 'relative',
                overflow: 'hidden',
                cursor: isPanning ? 'grab' : 'default',
                outline: 'none',
            }}
            id="dashboard-canvas"
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onKeyDown={handleKeyDown}
            role="none"
            tabIndex={-1}
        >
            <Box
                className="canvas-frame"
                style={{
                    transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
                    transformOrigin: '0 0',
                    position: 'relative',
                }}
            >
                {notes.map((note) => (
                    <MovableNoteCard note={note} key={note.uuid} zoom={zoom} />
                ))}
            </Box>
        </div>
    );
};

export default Canvas;
