import type { RndResizeCallback } from 'react-rnd';
import { Rnd } from 'react-rnd';
import {
    selectDashboardUserPreferences,
    setDashboardNoteDrawerExpanded,
    setDashboardNoteDrawerWidth,
} from '@common/store/user-preferences.slice';
import { useAppDispatch, useAppSelector } from '@common/hooks/store.hooks';
import NotesDrawer from '@modules/dashboard/components/notes-drawer/notes-drawer.component';
import { useEffect, useRef, useState } from 'react';
import { fetchNotes, setSelectedNoteIds } from '@common/store/notes.slice';
import NotesDrawerExpansionToggle
    from '@modules/dashboard/components/notes-drawer-expansion-toggle/notes-drawer-expansion-toggle.component';
import classNames from 'classnames';
import Canvas from '@modules/dashboard/components/canvas/canvas.component';
import style from './dashboard.module.less';

const DashboardView = () => {
    const dispatch = useAppDispatch();
    const { noteDrawerWidth, noteDrawerExpanded } = useAppSelector(selectDashboardUserPreferences);
    const overlayRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleResizeStop: RndResizeCallback = (_e, _direction, ref) => {
        const width = Math.round(+ref.style.width.replaceAll('%', ''));
        dispatch(setDashboardNoteDrawerWidth(width));
    };

    const handleToggleExpansion = () => {
        dispatch(setDashboardNoteDrawerExpanded(!noteDrawerExpanded));
    };

    useEffect(() => {
        dispatch(fetchNotes());
        dispatch(setSelectedNoteIds([]));
        setIsDragging(false);
    }, []);

    return (
        <>
            <div className={style.notesDrawerOverlay} ref={overlayRef}>
                <div className={classNames(style.notesDrawerExpandable, { [style.expanded]: noteDrawerExpanded && !isDragging })}>
                    <Rnd
                        size={{ width: `${noteDrawerWidth}%`, height: '100%' }}
                        minWidth="20%"
                        maxWidth="70%"
                        enableResizing={{
                            top: false,
                            right: true,
                            bottom: false,
                            left: false,
                            topRight: false,
                            bottomRight: false,
                            bottomLeft: false,
                            topLeft: false,
                        }}
                        disableDragging={true}
                        className={style.notesDrawer}
                        onResizeStop={handleResizeStop}
                    >
                        <NotesDrawer
                            overlayRef={overlayRef}
                            onDragStart={() => setIsDragging(true)}
                            onDragStop={() => setIsDragging(false)}
                        />
                        <NotesDrawerExpansionToggle
                            expanded={noteDrawerExpanded}
                            onToggle={handleToggleExpansion}
                        />
                    </Rnd>
                </div>
            </div>
            <Canvas />
        </>
    );
};

export default DashboardView;
