import {
 Box, Card, Flex, Inset, Text,
} from '@radix-ui/themes';
import { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { RxDoubleArrowDown, RxDoubleArrowUp } from 'react-icons/rx';
import style from './note-card.module.less';
import type { Note } from '../../../../../@types/notes.type';

interface NoteCardProps {
    note: Note;
    hoverEffect?: boolean;
}

const NoteCard = ({
    note,
    hoverEffect = true,
}: NoteCardProps) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isExpandable, setIsExpandable] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (contentRef.current) {
            const element = contentRef.current;
            const isOverflowing = element.scrollHeight > element.clientHeight;
            setIsExpandable(isOverflowing);
        }
    }, [note.content]);

    return (
        <Card
            size="2"
            className={classNames(style.component, { [style.hoverEffect]: hoverEffect })}
            onWheel={(event) => event.stopPropagation()}
        >
            <Inset>
                <Box className={classNames(style.content, { [style.expanded]: isExpanded })} ref={contentRef}>
                    {note.content}
                    {isExpandable && (
                        <div className={style.expansionTrigger} onClick={() => setIsExpanded(!isExpanded)} role="button" tabIndex={0}>
                            {isExpanded ? <RxDoubleArrowUp size={20} /> : <RxDoubleArrowDown size={20} />}
                        </div>
                    )}
                </Box>
                <Flex justify="between" className={style.footer}>
                    <Text color={note.category ? 'indigo' : 'gray'} size="1" weight="medium">
                        {note.category?.name ?? 'No category'}
                    </Text>
                    <Text color="gray" size="1">{note.createdAt.toLocaleString()}</Text>
                </Flex>
            </Inset>
        </Card>
    );
};

export default NoteCard;
