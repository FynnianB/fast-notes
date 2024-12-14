import style from './notes-drawer.module.less';
import { Flex, ScrollArea, Strong, Text } from '@radix-ui/themes';
import { selectUnplacedNoteItems } from '@common/store/selectors/select-note-items.selector';
import { useAppSelector } from '@common/hooks/store.hooks';
import classNames from 'classnames';
import NoteCard from '@modules/dashboard/components/note-card/note-card.component';

const NotesDrawer = () => {
    const notes = useAppSelector(selectUnplacedNoteItems);

    return (
        <>
            <ScrollArea scrollbars="vertical" className={classNames(style.component, 'notes-drawer')}>
                <Flex direction="column" gap="3" p="4" justify="start" minWidth="200px">
                    {notes.length === 0 && (
                        <Text align="center" color="gray" mt="7" size="2" wrap="nowrap"><Strong>No new Notes!</Strong><br /> I guess you need to think more...</Text>
                    )}
                    {notes.map(note => (
                        <NoteCard note={note} key={note.uuid}/>
                    ))}
                </Flex>
            </ScrollArea>
        </>
    )
};

export default NotesDrawer;