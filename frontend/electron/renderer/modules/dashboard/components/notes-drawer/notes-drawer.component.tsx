import style from './notes-drawer.module.less';
import { Card, Flex, ScrollArea } from '@radix-ui/themes';
import { useAppSelector } from '@common/hooks/store.hooks';
import { selectNoteItems } from '@common/store/notes.slice';

const NotesDrawer = () => {
    const notes = useAppSelector(selectNoteItems);

    return (
        <ScrollArea scrollbars="vertical" className={style.component}>
            <Flex direction="column" gap="3" p="4" justify="start">
                {notes.map(note => (
                    <Card size="2" key={note.uuid}>
                        {note.content}
                    </Card>
                ))}
            </Flex>
        </ScrollArea>
    )
};

export default NotesDrawer;