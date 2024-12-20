import { Box } from '@radix-ui/themes';
import { selectVisibleNoteItems } from '@common/store/selectors/select-note-items.selector';
import { useAppSelector } from '@common/hooks/store.hooks';
import CanvasNoteCard from '@modules/dashboard/components/canvas-note-card/canvas-note-card.component';
import type React from 'react';
import { useRef, useState } from 'react';
import {
    selectDashboardUserPreferences,
    setDashboardCanvasOffset,
    setDashboardCanvasZoom,
} from '@common/store/user-preferences.slice';
import debounce from 'lodash.debounce';
import store from '../../../../store';

const debouncedHandlePanning = debounce((newOffset) => {
    store.dispatch(setDashboardCanvasOffset(newOffset));
}, 50);

const debouncedHandleZooming = debounce((newOffset, newZoom) => {
    store.dispatch(setDashboardCanvasOffset(newOffset));
    store.dispatch(setDashboardCanvasZoom(newZoom));
}, 50);

const Canvas = () => {
    const notes = useAppSelector(selectVisibleNoteItems);
    const { canvasZoom, canvasOffset } = useAppSelector(selectDashboardUserPreferences);
    const [zoom, setZoom] = useState(canvasZoom);
    const [offset, setOffset] = useState(canvasOffset);
    const [isPanning, setIsPanning] = useState(false);
    const startOffset = useRef({ x: 0, y: 0 });
    const startMouse = useRef({ x: 0, y: 0 });
    const canvasRef = useRef<HTMLDivElement>(null);

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
        debouncedHandleZooming(newOffset, newZoom);
    };

    const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
        // Ensure the event only fires if the cursor is directly over the background
        if (event.target !== event.currentTarget) {
            return;
        }

        const zoomDelta = 1 + (event.deltaY * -0.002);
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
            debouncedHandlePanning(newOffset);
        }
    };

    const handleMouseUp = () => {
        setIsPanning(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (document.activeElement !== canvasRef.current) return;

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
            ref={canvasRef}
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
            role="button"
            tabIndex={0}
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
                    <CanvasNoteCard note={note} key={note.uuid} zoom={zoom} />
                ))}
            </Box>
        </div>
    );
};

export default Canvas;
