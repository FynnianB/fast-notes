import { Text } from '@radix-ui/themes';
import type { ComponentPropsWithoutRef, Ref } from 'react';
import { forwardRef } from 'react';
import classNames from 'classnames';
import type { Heading as HeadingType } from '../../../../../@types/notes.type';
import style from './heading.module.less';
import { UiColor } from '../../../../../main/enumerations/UiColor.enumeration';

interface HeadingProps {
    heading: HeadingType;
}

const Heading = ({
    heading,
    ...forwardedProps
}: HeadingProps, ref: Ref<HTMLDivElement>) => (
    <Text
        ref={ref}
        size={`${heading.fontSize}`}
        color={heading.color !== UiColor.WHITE ? heading.color : undefined}
        as="div"
        className={classNames(style.component, 'heading-drag-handle')}
        {...forwardedProps}
    >
        {heading.text}
    </Text>
);

type Props = HeadingProps & ComponentPropsWithoutRef<typeof Text>;

export default forwardRef<HTMLDivElement, Props>(Heading);
