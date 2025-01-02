import { Portal } from '@radix-ui/themes';
import type React from 'react';
import NoteCard from '@modules/dashboard/components/note-card/note-card.component';
import { useAppSelector } from '@common/hooks/store.hooks';
import { selectSelectedNoteItems } from '@common/store/selectors/select-note-items.selector';
import HeadingComponent from '@modules/dashboard/components/heading/heading.component';
import { CanvasObjectType } from '../../../../../main/enumerations/CanvasObjectType';
import type { Heading, Note } from '../../../../../@types/notes.type';

interface NoteSelectionPortalProps {
    canvasFrameRef: React.RefObject<HTMLDivElement>;
    offset: { x: number; y: number };
}

const NoteSelectionPortal = ({
    canvasFrameRef,
    offset,
}: NoteSelectionPortalProps) => {
    const canvasObjects = useAppSelector(selectSelectedNoteItems);

    return (
        <Portal container={canvasFrameRef.current}>
            <div style={{ position: 'relative' }}>
                {canvasObjects.map((canvasObject) => (
                    <div
                        key={canvasObject.uuid}
                        style={{
                            position: 'absolute',
                            top: (canvasObject.y ?? 0) + offset.y,
                            left: (canvasObject.x ?? 0) + offset.x,
                        }}
                    >
                        {canvasObject.type === CanvasObjectType.Note ? (
                            <NoteCard
                                note={canvasObject as Note}
                                style={{ outline: '2px solid var(--accent-8)' }}
                            />
                        ) : (
                            <HeadingComponent
                                heading={canvasObject as Heading}
                                style={{ outline: '2px solid var(--accent-8)' }}
                            />
                        )}
                    </div>
                ))}
            </div>
        </Portal>
    );
};

export default NoteSelectionPortal;
