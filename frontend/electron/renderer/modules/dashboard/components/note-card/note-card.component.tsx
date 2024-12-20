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
    const [isCollapsable, setIsCollapsable] = useState<boolean | undefined>(undefined);
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (contentRef.current) {
            const element = contentRef.current;
            const isOverflowing = element.scrollHeight > element.clientHeight;
            setIsCollapsable(isOverflowing);
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
                <Box
                    className={classNames(
                        style.content,
                        { [style.fullHeight]: isExpanded },
                    )}
                    ref={contentRef}
                >
                    {note.content}
                    {(isCollapsable === undefined || isCollapsable) && !isExpanded && (
                        <div
                            className={style.expansionTriggerZone}
                            onClick={() => setIsExpanded(!isExpanded)}
                            role="button"
                            tabIndex={0}
                        />
                    )}
                    {isCollapsable && (
                        isExpanded
                            ? <RxDoubleArrowUp size={20} className={style.expansionTrigger} onClick={() => setIsExpanded(false)} />
                            : <RxDoubleArrowDown size={20} className={style.expansionTrigger} onClick={() => setIsExpanded(true)} />
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
