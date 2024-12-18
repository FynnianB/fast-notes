import { Outlet } from 'react-router';
import Sidebar from '@modules/sidebar/components/sidebar/sidebar.component';
import ErrorBoundary from '@common/components/error-boundary/error-boundary.component';
import style from './main-window.module.less';

const MainWindowView = () => (
    <ErrorBoundary>
        <div className={style.component}>
            <header className={style.header} />
            <div className={style.content}>
                <Sidebar />
                <main>
                    <Outlet />
                </main>
            </div>
        </div>
    </ErrorBoundary>
);

export default MainWindowView;
