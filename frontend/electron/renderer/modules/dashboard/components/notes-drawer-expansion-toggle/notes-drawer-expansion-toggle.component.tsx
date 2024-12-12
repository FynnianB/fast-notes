import style from './notes-drawer-expansion-toggle.module.less';
import { RxChevronRight } from 'react-icons/rx';
import React from 'react';
import classNames from 'classnames';

interface NotesDrawerExpansionToggleProps {
    expanded: boolean;
    onToggle: React.MouseEventHandler<SVGElement>;
}

const NotesDrawerExpansionToggle = ({
    expanded,
    onToggle
}: NotesDrawerExpansionToggleProps) => (
    <div className={classNames(style.component, { [style.expanded]: expanded })}>
        <RxChevronRight size={20} className={style.toggle} onClick={onToggle}/>
    </div>
);

export default NotesDrawerExpansionToggle;