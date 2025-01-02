import { ContextMenu, Text } from '@radix-ui/themes';
import type { KeyboardEvent, ReactElement } from 'react';
import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@common/hooks/store.hooks';
import { setSelectedNoteIds } from '@common/store/notes.slice';
import { useCanvasService } from '@modules/dashboard/services/canvas.service';
import classNames from 'classnames';
import { useSelectionService } from '@modules/dashboard/services/selection.service';
import HeadingEditInput from '@modules/dashboard/components/heading-edit-input/heading-edit-input.component';
import type { Heading } from '../../../../../@types/notes.type';
import { UiColor } from '../../../../../main/enumerations/UiColor.enumeration';
import style from './heading-context-menu.module.less';

const availableColors: Exclude<UiColor, UiColor.BLACK>[] = [
    UiColor.INDIGO,
    UiColor.RED,
    UiColor.YELLOW,
    UiColor.GREEN,
    UiColor.GRAY,
    UiColor.WHITE,
];

type AvailableSizesType = 5 | 6 | 7 | 8 | 9;
const availableSizes: AvailableSizesType[] = [5, 6, 7, 8, 9];

const textFromSize = (size: AvailableSizesType) => {
    switch (size) {
        case 5:
            return 'Tiny';
        case 6:
            return 'Small';
        case 7:
            return 'Normal';
        case 8:
            return 'Large';
        case 9:
            return 'Extra';
        default:
            return '';
    }
};

interface HeadingContextMenuProps {
    heading: Heading;
    children: ReactElement;
}

const HeadingContextMenu = ({
    heading,
    children,
}: HeadingContextMenuProps) => {
    const dispatch = useAppDispatch();
    const { updateHeading, deleteCanvasObject } = useCanvasService();
    const { deleteSelectedCanvasObjects, moveSelectedNotesToDrawer } = useSelectionService();
    const selectedObjectIds = useAppSelector((state) => state.notes.selectedNoteIds);
    const [isEditing, setIsEditing] = useState(false);

    const isBulkOperation = selectedObjectIds.length > 1 && selectedObjectIds.includes(heading.uuid);

    const handleOpenChange = (open: boolean) => {
        if (!open) return;
        if (selectedObjectIds.includes(heading.uuid)) return;

        dispatch(setSelectedNoteIds([heading.uuid]));
    };

    const handleChangeColor = (color: Exclude<UiColor, UiColor.BLACK>) => {
        if (color === heading.color) return;
        updateHeading({
            ...heading,
            color: color,
        });
    };

    const handleChangeSize = (size: AvailableSizesType) => {
        if (size === heading.fontSize) return;
        updateHeading({
            ...heading,
            fontSize: size,
        });
    };

    const handleSaveEdit = (text: string) => {
        if (text !== heading.text) {
            updateHeading({
                ...heading,
                text,
            });
        }

        setIsEditing(false);
    };

    const handleDelete = () => deleteCanvasObject(heading);

    const handleBulkMoveToDrawer = () => moveSelectedNotesToDrawer();

    const handleBulkDelete = () => deleteSelectedCanvasObjects();

    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Backspace' || e.key === 'Delete') {
            e.preventDefault();
            e.stopPropagation();
            handleDelete();
        } else if (e.key === 'e' && e.ctrlKey) {
            setIsEditing(true);
        }
    };

    return (
        <>
            {!isEditing && (
                <ContextMenu.Root onOpenChange={handleOpenChange}>
                    <ContextMenu.Trigger>
                        {React.cloneElement(children, {
                            onDoubleClick: () => setIsEditing(true),
                            onKeyDown: handleKeyDown,
                            tabIndex: 0,
                        })}
                    </ContextMenu.Trigger>
                    <ContextMenu.Content variant="soft">
                        {!isBulkOperation ? (
                            <>
                                <ContextMenu.Item shortcut="⌘ E" onSelect={() => setIsEditing(true)}>Edit</ContextMenu.Item>
                                <ContextMenu.Sub>
                                    <ContextMenu.SubTrigger>Change color</ContextMenu.SubTrigger>
                                    <ContextMenu.SubContent>
                                        {availableColors.map((color) => (
                                            <ContextMenu.Item
                                                key={color}
                                                onSelect={() => handleChangeColor(color)}
                                                className={classNames({ [style.menuItemSelected]: heading.color === color })}
                                            >
                                                <Text color={color !== UiColor.WHITE ? color : undefined} weight="medium">{color.toUpperCase()}</Text>
                                            </ContextMenu.Item>
                                        ))}
                                    </ContextMenu.SubContent>
                                </ContextMenu.Sub>
                                <ContextMenu.Sub>
                                    <ContextMenu.SubTrigger>Change size</ContextMenu.SubTrigger>
                                    <ContextMenu.SubContent>
                                        {availableSizes.map((size) => (
                                            <ContextMenu.Item
                                                key={size}
                                                onSelect={() => handleChangeSize(size)}
                                                style={{ height: 'fit-content' }}
                                                className={classNames({ [style.menuItemSelected]: heading.fontSize === size })}
                                            >
                                                <Text size={`${size}`}>{textFromSize(size)}</Text>
                                            </ContextMenu.Item>
                                        ))}
                                    </ContextMenu.SubContent>
                                </ContextMenu.Sub>
                                <ContextMenu.Item shortcut="⌫" color="red" onSelect={handleDelete}>Delete</ContextMenu.Item>
                            </>
                        ) : (
                            <>
                                <ContextMenu.Item onSelect={handleBulkMoveToDrawer}>Move selected back to drawer</ContextMenu.Item>
                                <ContextMenu.Item shortcut="⌫" color="red" onSelect={handleBulkDelete}>Delete selected</ContextMenu.Item>
                            </>
                        )}
                    </ContextMenu.Content>
                </ContextMenu.Root>
            )}
            {isEditing && (
                <HeadingEditInput
                    heading={heading}
                    onSubmit={handleSaveEdit}
                    onCancel={() => setIsEditing(false)}
                />
            )}
        </>
    );
};

export default HeadingContextMenu;
