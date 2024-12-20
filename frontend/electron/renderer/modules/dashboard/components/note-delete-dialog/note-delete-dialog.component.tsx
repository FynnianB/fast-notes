import { Button, AlertDialog, Flex } from '@radix-ui/themes';

interface NoteDeleteDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: () => void;
}

const NoteDeleteDialog = ({
    open,
    onOpenChange,
    onSubmit,
}: NoteDeleteDialogProps) => (
    <AlertDialog.Root open={open} onOpenChange={onOpenChange}>
        <AlertDialog.Content maxWidth="450px">
            <AlertDialog.Title>Delete note</AlertDialog.Title>
            <AlertDialog.Description size="2">
                Are you sure? This action cannot be undone. This will permanently delete the note.
            </AlertDialog.Description>

            <Flex gap="3" mt="4" justify="end">
                <AlertDialog.Cancel>
                    <Button variant="soft" color="gray" type="submit">
                        Cancel
                    </Button>
                </AlertDialog.Cancel>
                <AlertDialog.Cancel>
                    <Button variant="solid" color="red" type="submit" onClick={onSubmit}>
                        Delete permanently
                    </Button>
                </AlertDialog.Cancel>
            </Flex>
        </AlertDialog.Content>
    </AlertDialog.Root>
);

export default NoteDeleteDialog;
