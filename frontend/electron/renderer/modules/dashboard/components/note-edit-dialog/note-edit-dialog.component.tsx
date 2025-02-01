import { Button, Dialog, Flex } from '@radix-ui/themes';
import MarkdownEditor from '@common/components/markdown-editor/markdown-editor.component';
import { useState } from 'react';
import type { Note } from '../../../../../@types/notes.type';
import style from './note-edit-dialog.module.less';

interface NoteEditDialogProps {
    note: Note,
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (content: string) => void;
}

const NoteEditDialog = ({
    note,
    open,
    onOpenChange,
    onSubmit,
}: NoteEditDialogProps) => {
    const [content, setContent] = useState(note.content);

    return (
        <Dialog.Root open={open} onOpenChange={onOpenChange}>
            <Dialog.Content style={{ width: '500px' }}>
                <Dialog.Title>Edit note</Dialog.Title>
                <Dialog.Description>Make changes to your note below.</Dialog.Description>
                <div className={style.markdownWrapper}>
                    <MarkdownEditor
                        initialText={content}
                        onChange={setContent}
                    />
                </div>
                <Flex gap="3" mt="4" justify="end">
                    <Dialog.Close>
                        <Button variant="soft" color="gray" type="submit">
                            Cancel
                        </Button>
                    </Dialog.Close>
                    <Dialog.Close>
                        <Button variant="solid" color="indigo" type="submit" onClick={() => onSubmit(content)}>
                            Save
                        </Button>
                    </Dialog.Close>
                </Flex>
            </Dialog.Content>
        </Dialog.Root>
    );
};

export default NoteEditDialog;
