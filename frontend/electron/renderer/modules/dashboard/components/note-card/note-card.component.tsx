import { Note } from '../../../../../@types/notes.type';
import { Box, Card, Flex, Inset, Text } from '@radix-ui/themes';
import style from './note-card.module.less';
import { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { RxDoubleArrowDown, RxDoubleArrowUp } from 'react-icons/rx';

const NoteCard = ({ note }: { note: Note }) => {
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
        <Card size="2" className={style.component}>
            <Inset>
                <Box className={classNames(style.content, { [style.expanded]: isExpanded })} ref={contentRef}>
                    {note.content}
                    {!isExpanded && isExpandable && (<div className={style.expansionTrigger} onClick={() => setIsExpanded(true)}><RxDoubleArrowDown size={20}/></div>)}
                    {isExpanded && isExpandable && (<div className={style.reductionTrigger} onClick={() => setIsExpanded(false)}><RxDoubleArrowUp size={20}/></div>)}
                </Box>
                <Flex justify="between" className={style.footer}>
                    <Text color="indigo" size="1" weight="medium">
                        {note.category?.name ?? 'No category'}
                    </Text>
                    <Text color="gray" size="1">{note.createdAt.toLocaleString()}</Text>
                </Flex>
            </Inset>
        </Card>
    );
};

export default NoteCard;