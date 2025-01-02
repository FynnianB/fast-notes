import type { DraggableData } from 'react-rnd';
import { Rnd } from 'react-rnd';
import type React from 'react';
import { useEffect, useState } from 'react';
import NoteSelectionPortal from '@modules/dashboard/components/note-selection-portal/note-selection-portal.component';
import { useAppSelector } from '@common/hooks/store.hooks';
import type { DraggableEvent } from 'react-draggable';
import { useCanvasService } from '@modules/dashboard/services/canvas.service';
import { useSelectionService } from '@modules/dashboard/services/selection.service';
import HeadingComponent from '@modules/dashboard/components/heading/heading.component';
import HeadingContextMenu from '@modules/dashboard/components/heading-context-menu/heading-context-menu.component';
import type { Heading } from '../../../../../@types/notes.type';

const isOffsetSignificantEnough = (offset: { x: number; y: number }) => Math.abs(offset.x) > 0.1 || Math.abs(offset.y) > 0.1;

interface CanvasHeadingProps {
    heading: Heading;
    zoom: number;
    isSelected: boolean;
    onSelectionToggle: (heading: Heading, selected: boolean) => void;
    onSelectSingle: (heading: Heading) => void;
    isDraggingSelection: boolean;
    onDraggingSelectionChange: (isDragging: boolean) => void;
    canvasFrameRef: React.RefObject<HTMLDivElement>;
}

const CanvasHeading = ({
    heading,
    zoom,
    isSelected,
    onSelectionToggle,
    onSelectSingle,
    isDraggingSelection,
    onDraggingSelectionChange,
    canvasFrameRef,
}: CanvasHeadingProps) => {
    const { moveCanvasObject } = useCanvasService();
    const { moveSelectedCanvasObjects } = useSelectionService();
    const selectedNoteIds = useAppSelector((state) => state.notes.selectedNoteIds);
    const [position, setPosition] = useState({ x: heading.x ?? 0, y: heading.y ?? 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [draggingStart, setDraggingStart] = useState({ x: 0, y: 0 });
    const [selectionOffset, setSelectionOffset] = useState({ x: 0, y: 0 });

    const isBulkOperation = selectedNoteIds.length > 1 && selectedNoteIds.includes(heading.uuid);

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
            if (heading.x && heading.y && isOffsetSignificantEnough({ x: data.x - heading.x, y: data.y - heading.y })) {
                moveCanvasObject(heading, { x: data.x, y: data.y });
            }
        }
    };

    const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
        if (event.ctrlKey) {
            if (event.button === 0) {
                onSelectionToggle(heading, !isSelected);
            } else {
                event.preventDefault();
            }
        } else if (!isSelected) {
            onSelectSingle(heading);
        }
    };

    useEffect(() => {
        setPosition({ x: heading.x ?? 0, y: heading.y ?? 0 });
    }, [heading.x, heading.y]);

    return (
        <>
            <Rnd
                position={{ x: position.x, y: position.y }}
                enableResizing={false}
                onDragStart={handleDragStart}
                onDrag={handleDrag}
                onDragStop={handleDragStop}
                scale={zoom}
                dragHandleClassName="heading-drag-handle"
                style={{ visibility: isDraggingSelection && isSelected ? 'hidden' : 'visible' }}
            >
                <HeadingContextMenu heading={heading}>
                    <HeadingComponent
                        heading={heading}
                        style={{
                            outline: isSelected ? '2px solid currentColor' : 'none',
                        }}
                        onMouseDown={handleMouseDown}
                    />
                </HeadingContextMenu>
            </Rnd>
            {isBulkOperation && isDragging && (
                <NoteSelectionPortal canvasFrameRef={canvasFrameRef} offset={selectionOffset} />
            )}
        </>
    );
};

export default CanvasHeading;
