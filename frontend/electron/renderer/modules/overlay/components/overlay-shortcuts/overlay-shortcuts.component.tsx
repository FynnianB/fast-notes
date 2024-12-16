import { Flex, Kbd, Text } from '@radix-ui/themes';
import style from './overlay-shortcuts.module.less';

const Shortcut = ({ label, description }: { label: string, description: string }) => (
    <Flex direction="row" gap="1" justify="center">
        <Kbd size="1" className={style.kbd}>{label}</Kbd>
        <Text size="1" wrap="nowrap" weight="medium" className={style.description}>{description}</Text>
    </Flex>
);

const OverlayShortcuts = () => (
    <Flex direction="row" gap="6" justify="center" className={style.component}>
        <Shortcut label="Ctrl + M" description="Minimize" />
        <Shortcut label="Esc" description="Close" />
        <Shortcut label="Ctrl + Enter" description="Save" />
    </Flex>
);

export default OverlayShortcuts;
