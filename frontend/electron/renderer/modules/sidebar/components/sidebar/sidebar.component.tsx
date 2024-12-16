import SidebarNavItem from '@modules/sidebar/components/sidebar-nav-item/sidebar-nav-item.component';
import { Route } from '@common/enums/route.enum';
import {
 RxHome, RxGear, RxPerson, RxCardStackPlus, RxPlus,
} from 'react-icons/rx';
import { openOverlay } from '@common/api/notes.api';
import style from './sidebar.module.less';

const Sidebar = () => (
    <aside className={style.component}>
        <nav>
            <SidebarNavItem route={Route.DASHBOARD}><RxHome size={20} /></SidebarNavItem>
            <SidebarNavItem route={Route.CATEGORIES}><RxCardStackPlus size={20} /></SidebarNavItem>
            <SidebarNavItem route={null} onClick={openOverlay}><RxPlus size={20} /></SidebarNavItem>
        </nav>
        <nav>
            <SidebarNavItem route={null}><RxPerson size={20} /></SidebarNavItem>
            <SidebarNavItem route={Route.SETTINGS}><RxGear size={20} /></SidebarNavItem>
        </nav>
    </aside>
);

export default Sidebar;
