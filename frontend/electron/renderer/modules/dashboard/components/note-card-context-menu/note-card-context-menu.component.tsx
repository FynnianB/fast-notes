import { ContextMenu } from '@radix-ui/themes';

interface NoteCardContextMenuContentProps {
    onSelectEdit: () => void;
    onSelectDelete: () => void;
    onSelectMoveToDrawer: () => void;
}

const NoteCardContextMenuContent = ({
    onSelectEdit,
    onSelectDelete,
    onSelectMoveToDrawer,
}: NoteCardContextMenuContentProps) => {
    const categories = [
        { id: 1, name: 'Not implemented' },
        { id: 2, name: 'Coming soon' },
        { id: 3, name: 'Feature to go' },
    ];

    return (
        <ContextMenu.Content variant="soft">
            <ContextMenu.Item shortcut="⌘ E" onSelect={onSelectEdit}>Edit</ContextMenu.Item>

            <ContextMenu.Separator />

            <ContextMenu.Sub>
                <ContextMenu.SubTrigger disabled>Move to category</ContextMenu.SubTrigger>
                <ContextMenu.SubContent>
                    {categories.map((category) => (
                        <ContextMenu.Item key={category.id}>{category.name}</ContextMenu.Item>
                    ))}
                </ContextMenu.SubContent>
            </ContextMenu.Sub>
            <ContextMenu.Item onSelect={onSelectMoveToDrawer}>Move back to drawer</ContextMenu.Item>

            <ContextMenu.Separator />

            <ContextMenu.Item shortcut="⌫" color="red" onSelect={onSelectDelete}>Delete</ContextMenu.Item>
        </ContextMenu.Content>
    );
};

export default NoteCardContextMenuContent;
