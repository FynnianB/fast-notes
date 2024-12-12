import style from './sidebar.module.less';
import SidebarNavItem from '@modules/sidebar/components/sidebar-nav-item/sidebar-nav-item.component';
import { Route } from '@common/enums/route.enum';

const Sidebar = () => (
    <aside className={style.component}>
        <nav>
            <SidebarNavItem route={Route.DASHBOARD}>HOME</SidebarNavItem>
            <SidebarNavItem route={Route.CATEGORIES}>CATS</SidebarNavItem>
            <SidebarNavItem route={Route.CATEGORIES_ADD}>ADD</SidebarNavItem>
            {/*AddNote/OpenOverlay*/}
        </nav>
        <nav>
            {/*User*/}
            <SidebarNavItem route={Route.SETTINGS}>SETT</SidebarNavItem>
        </nav>
    </aside>
);

export default Sidebar;