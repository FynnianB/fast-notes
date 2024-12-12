import React from 'react';
import { NavLink } from 'react-router';
import { Route } from '@common/enums/route.enum';
import style from './sidebar-nav-item.module.less';
import classNames from 'classnames';

interface SidebarNavItemProps {
    route: Route|null;
    children: React.ReactNode;
    onClick?: React.MouseEventHandler<HTMLDivElement>;
}

const SidebarNavItem = ({
    route,
    children,
    onClick,
}: SidebarNavItemProps) => {
    if (route === null) {
        return <div className={style.component} onClick={onClick}>{children}</div>;
    }

    return (
        <NavLink
            to={route}
            end
            className={({ isActive }) => classNames(style.component, { [style.active]: isActive })}
        >
            {({ isActive }) => (
                <>
                    {isActive && <div className={style.activeIndicator} />}
                    {children}
                </>
            )}
        </NavLink>
    );
}

export default SidebarNavItem;