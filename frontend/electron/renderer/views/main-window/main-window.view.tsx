import { Outlet } from 'react-router';
import style from './main-window.module.less'
import Sidebar from '@modules/sidebar/components/sidebar/sidebar.component';

const MainWindowView = () => {
    return (
        <div className={style.component}>
            <header className={style.header}></header>
            <div className={style.content}>
                <Sidebar />
                <main>
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default MainWindowView;