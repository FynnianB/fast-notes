import { Button, AlertDialog, Flex, Text } from '@radix-ui/themes';

interface NoteDeleteDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: () => void;
    count?: number;
}

const NoteDeleteDialog = ({
    open,
    onOpenChange,
    onSubmit,
    count = 1,
}: NoteDeleteDialogProps) => (
    <AlertDialog.Root open={open} onOpenChange={onOpenChange}>
        <AlertDialog.Content maxWidth="450px">
            <AlertDialog.Title>Delete {count > 1 ? `all ${count} objects` : 'object'}</AlertDialog.Title>
            <AlertDialog.Description size="2">
                Are you sure? This action cannot be undone.
                {' '}
                {count > 1 ? (
                    <>This will permanently delete all <Text color="red">{count}</Text> selected objects</>
                ) : (
                    <>This will permanently delete the object</>
                )}
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
