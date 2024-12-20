import {
 Flex, Portal, ScrollArea, Strong, Text,
} from '@radix-ui/themes';
import { selectUnplacedNoteItems } from '@common/store/selectors/select-note-items.selector';
import { useAppSelector } from '@common/hooks/store.hooks';
import classNames from 'classnames';
import NoteCard from '@modules/dashboard/components/note-card/note-card.component';
import type { RefObject } from 'react';
import type React from 'react';
import { useEffect, useRef } from 'react';
import { useStateRef } from '@common/hooks/react.hooks';
import { useCanvasService } from '@modules/dashboard/services/canvas.service';
import type { Note } from '../../../../../@types/notes.type';
import style from './notes-drawer.module.less';

interface NotesDrawerProps {
    overlayRef: RefObject<HTMLDivElement>;
    onDragStart?: () => void;
    onDragStop?: () => void;
}

const NotesDrawer = ({
    overlayRef,
    onDragStart = () => {},
    onDragStop = () => {},
}: NotesDrawerProps) => {
    const { moveNoteFromDrawerToCanvas } = useCanvasService();
    const notes = useAppSelector(selectUnplacedNoteItems);
    const [draggingNote, setDraggingNote, draggingNoteRef] = useStateRef<Note | null>(null);
    const [, setMouseOffset, mouseOffsetRef] = useStateRef<{ x: number, y: number }>({ x: 0, y: 0 });
    const [draggingPosition, setDraggingPosition, draggingPositionRef] = useStateRef<{ x: number, y: number }>({ x: 0, y: 0 });
    const portalRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: MouseEvent) => {
        if (draggingNoteRef.current === null) return;

        if (portalRef.current) {
            const bounds = portalRef.current.getBoundingClientRect();
            if (e.clientX < bounds.left || e.clientX > bounds.right || e.clientY < bounds.top || e.clientY > bounds.bottom) {
                return;
            }
        }

        setDraggingPosition({
            x: e.clientX + mouseOffsetRef.current.x,
            y: e.clientY + mouseOffsetRef.current.y,
        });
    };

    const handleMouseDown = (note: Note, e: React.MouseEvent<HTMLDivElement>) => {
        if (!overlayRef.current || e.button !== 0) return;
        e.preventDefault();
        setDraggingNote(note);
        const bounds = e.currentTarget.getBoundingClientRect();
        const offset = {
            x: (bounds.x - e.clientX) - overlayRef.current.getBoundingClientRect().x,
            y: (bounds.y - e.clientY) - overlayRef.current.getBoundingClientRect().y,
        };
        setMouseOffset(offset);
        setDraggingPosition({
            x: e.clientX + offset.x,
            y: e.clientY + offset.y,
        });
        document.addEventListener('mousemove', handleMouseMove);
        onDragStart();
    };

    const handleMouseUp = () => {
        if (draggingNoteRef.current === null) return;

        moveNoteFromDrawerToCanvas(draggingNoteRef.current, draggingPositionRef.current);
        document.removeEventListener('mousemove', handleMouseMove);
        setDraggingNote(null);
        onDragStop();
    };

    useEffect(() => {
        document.addEventListener('mouseup', handleMouseUp);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, []);

    return (
        <>
            <ScrollArea scrollbars="vertical" className={classNames(style.component, 'notes-drawer')}>
                <Flex direction="column" gap="3" p="4" justify="start" minWidth="200px">
                    {notes.length === 0 && (
                        <Text align="center" color="gray" mt="7" size="2" wrap="nowrap"><Strong>No new Notes!</Strong><br /> I guess you need to think more...</Text>
                    )}
                    {notes.map((note) => (
                        <div
                            role="none"
                            key={note.uuid}
                            className={classNames(style.cardWrapper, { [style.currentlyDragged]: draggingNote?.uuid === note.uuid })}
                            onMouseDown={(e) => handleMouseDown(note, e)}
                        >
                            <NoteCard note={note} />
                        </div>
                    ))}
                </Flex>
            </ScrollArea>
            {draggingNote && overlayRef.current && (
                <Portal container={overlayRef.current} className={style.portal} ref={portalRef}>
                    <div
                        className={style.portalNoteCard}
                        style={{
                            top: draggingPosition.y,
                            left: draggingPosition.x,
                        }}
                    >
                        <NoteCard note={draggingNote} />
                    </div>
                </Portal>
            )}
        </>
    );
};

export default NotesDrawer;
