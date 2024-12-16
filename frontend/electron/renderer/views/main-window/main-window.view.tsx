import { Outlet } from 'react-router';
import Sidebar from '@modules/sidebar/components/sidebar/sidebar.component';
import style from './main-window.module.less';

const MainWindowView = () => (
    <div className={style.component}>
        <header className={style.header} />
        <div className={style.content}>
            <Sidebar />
            <main>
                <Outlet />
            </main>
        </div>
    </div>
);

export default MainWindowView;
