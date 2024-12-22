import { Portal } from '@radix-ui/themes';
import type React from 'react';
import NoteCard from '@modules/dashboard/components/note-card/note-card.component';
import { useAppSelector } from '@common/hooks/store.hooks';
import { selectSelectedNoteItems } from '@common/store/selectors/select-note-items.selector';

interface NoteSelectionPortalProps {
    canvasFrameRef: React.RefObject<HTMLDivElement>;
    offset: { x: number; y: number };
}

const NoteSelectionPortal = ({
    canvasFrameRef,
    offset,
}: NoteSelectionPortalProps) => {
    const selectedNotes = useAppSelector(selectSelectedNoteItems);

    return (
        <Portal container={canvasFrameRef.current}>
            <div style={{ position: 'relative' }}>
                {selectedNotes.map((note) => (
                    <div
                        key={note.uuid}
                        style={{
                            position: 'absolute',
                            top: (note.y ?? 0) + offset.y,
                            left: (note.x ?? 0) + offset.x,
                        }}
                    >
                        <NoteCard
                            note={note}
                            style={{ outline: '2px solid var(--accent-8)' }}
                        />
                    </div>
                ))}
            </div>
        </Portal>
    );
};

export default NoteSelectionPortal;
