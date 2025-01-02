import { Button, Dialog, Flex, TextArea } from '@radix-ui/themes';
import { type FormEvent, useEffect, useRef, useState } from 'react';
import type { Note } from '../../../../../@types/notes.type';

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
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const updateTextareaHeight = () => {
        if (textareaRef.current) {
            const newHeight = textareaRef.current.scrollHeight;
            textareaRef.current.style.height = `${newHeight}px`;
        }
    };

    useEffect(() => {
        setContent(note.content);
        setTimeout(() => {
            updateTextareaHeight();
        }, 10);
    }, [open]);

    const handleInput = async (e: FormEvent<HTMLTextAreaElement>) => {
        setContent(e.currentTarget.value);
        updateTextareaHeight();
    };

    return (
        <Dialog.Root open={open} onOpenChange={onOpenChange}>
            <Dialog.Content style={{ width: 'fit-content' }}>
                <Dialog.Title>Edit note</Dialog.Title>
                <Dialog.Description>Make changes to your note below.</Dialog.Description>
                <TextArea
                    placeholder="Enter your note here..."
                    value={content}
                    onInput={handleInput}
                    ref={textareaRef}
                    variant="surface"
                    autoFocus
                    size="3"
                    style={{
                        minHeight: '3lh',
                        maxHeight: '20lh',
                        width: '500px',
                }}
                    mt="2"
                />
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
