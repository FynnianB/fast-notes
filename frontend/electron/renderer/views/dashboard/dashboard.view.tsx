import { Rnd, RndResizeCallback } from 'react-rnd';
import style from './dashboard.module.less'
import { selectUserPreferences, setDashboardNoteDrawerWidth } from '@common/store/user-preferences.slice';
import { useAppDispatch, useAppSelector } from '@common/hooks/store.hooks';
import NotesDrawer from '@modules/dashboard/components/notes-drawer/notes-drawer.component';
import { useEffect } from 'react';
import { fetchNotes } from '@common/store/notes.slice';

const DashboardView = () => {
    const dispatch = useAppDispatch();
    const { dashboardNoteDrawerWidth } = useAppSelector(selectUserPreferences);

    const handleResizeStop: RndResizeCallback = (_e, _direction, ref) => {
        const width = Math.round(+ref.style.width.replaceAll('%', ''));
        dispatch(setDashboardNoteDrawerWidth(width));
    }

    useEffect(() => {
        dispatch(fetchNotes());
    }, []);

    return (
        <>
            <Rnd
                size={{ width: dashboardNoteDrawerWidth+'%', height: '100%' }}
                minWidth="20%"
                maxWidth="70%"
                enableResizing={{ top: false, right: true, bottom: false, left: false, topRight: false, bottomRight: false, bottomLeft: false, topLeft: false }}
                disableDragging={true}
                className={style.notesDrawer}
                onResizeStop={handleResizeStop}
            >
                <NotesDrawer />
            </Rnd>
            <div className={style.content}>MAP</div>
        </>
    );
}

export default DashboardView;