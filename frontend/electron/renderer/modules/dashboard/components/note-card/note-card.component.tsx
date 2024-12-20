import {
 Box, Card, Flex, Inset, Text,
} from '@radix-ui/themes';
import type { ComponentPropsWithoutRef, Ref } from 'react';
import { forwardRef, useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { RxDoubleArrowDown, RxDoubleArrowUp } from 'react-icons/rx';
import style from './note-card.module.less';
import type { Note } from '../../../../../@types/notes.type';

interface NoteCardProps {
    note: Note;
    enableHoverEffect?: boolean;
}

const NoteCard = ({
    note,
    enableHoverEffect = true,
    ...cardProps
}: NoteCardProps, ref: Ref<HTMLDivElement>) => {
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
            ref={ref}
            size="2"
            className={classNames(style.component, { [style.hoverEffect]: enableHoverEffect })}
            {...cardProps}
        >
            <Inset>
                <Box className={classNames(style.content, { [style.expanded]: isExpanded })} ref={contentRef}>
                    {note.content}
                    {isExpandable && (
                        <div
                            className={style.expansionTrigger}
                            onClick={() => setIsExpanded(!isExpanded)}
                            role="button"
                            tabIndex={0}
                        >
                            {isExpanded ? <RxDoubleArrowUp size={20} /> : <RxDoubleArrowDown size={20} />}
                        </div>
                    )}
                </Box>
                <Flex justify="between" className={classNames(style.footer, 'card-footer')}>
                    <Text color={note.category ? 'indigo' : 'gray'} size="1" weight="medium">
                        {note.category?.name ?? 'No category'}
                    </Text>
                    <Text color="gray" size="1">{note.createdAt.toLocaleString()}</Text>
                </Flex>
            </Inset>
        </Card>
    );
};

type Props = NoteCardProps & ComponentPropsWithoutRef<typeof Card>;

export default forwardRef<HTMLDivElement, Props>(NoteCard);
