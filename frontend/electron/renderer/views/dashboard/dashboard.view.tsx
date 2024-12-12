import { Rnd, RndResizeCallback } from 'react-rnd';
import style from './dashboard.module.less'
import {
    selectUserPreferences,
    setDashboardNoteDrawerExpanded,
    setDashboardNoteDrawerWidth,
} from '@common/store/user-preferences.slice';
import { useAppDispatch, useAppSelector } from '@common/hooks/store.hooks';
import NotesDrawer from '@modules/dashboard/components/notes-drawer/notes-drawer.component';
import { useEffect } from 'react';
import { fetchNotes } from '@common/store/notes.slice';
import NotesDrawerExpansionToggle
    from '@modules/dashboard/components/notes-drawer-expansion-toggle/notes-drawer-expansion-toggle.component';
import classNames from 'classnames';

const DashboardView = () => {
    const dispatch = useAppDispatch();
    const { dashboardNoteDrawerWidth, dashboardNoteDrawerExpanded } = useAppSelector(selectUserPreferences);

    const handleResizeStop: RndResizeCallback = (_e, _direction, ref) => {
        const width = Math.round(+ref.style.width.replaceAll('%', ''));
        dispatch(setDashboardNoteDrawerWidth(width));
    }

    const handleToggleExpansion = () => {
        dispatch(setDashboardNoteDrawerExpanded(!dashboardNoteDrawerExpanded));
    }

    useEffect(() => {
        dispatch(fetchNotes());
    }, []);

    return (
        <>
            <div className={classNames(style.notesDrawerWrapper, { [style.expanded]: dashboardNoteDrawerExpanded })}>
                <Rnd
                    size={{ width: dashboardNoteDrawerWidth + '%', height: '100%' }}
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
                        topLeft: false
                    }}
                    disableDragging={true}
                    className={style.notesDrawer}
                    onResizeStop={handleResizeStop}
                >
                    <NotesDrawer />
                    <NotesDrawerExpansionToggle expanded={dashboardNoteDrawerExpanded} onToggle={handleToggleExpansion} />
                </Rnd>
            </div>
            <div className={style.content}>MAP</div>
        </>
    );
}

export default DashboardView;