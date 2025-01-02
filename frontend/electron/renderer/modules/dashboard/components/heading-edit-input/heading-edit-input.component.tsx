import type React from 'react';
import { useState, useEffect, useRef } from 'react';
import type { Heading } from '../../../../../@types/notes.type';
import style from './heading-edit-input.module.less';

interface HeadingEditInputProps {
    heading: Heading;
    onSubmit: (text: string) => void;
    onCancel: () => void;
}

const HeadingEditInput = ({
    heading,
    onSubmit,
    onCancel,
}: HeadingEditInputProps) => {
    const [text, setText] = useState(heading.text);
    const inputRef = useRef<HTMLInputElement>(null);
    const spanRef = useRef<HTMLSpanElement>(null);
    const [inputWidth, setInputWidth] = useState(1);

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            onSubmit(text);
        } else if (event.key === 'Escape') {
            onCancel();
        }
    };

    useEffect(() => {
        if (spanRef.current) {
            const newWidth = spanRef.current.offsetWidth + 50;
            setInputWidth(newWidth);
        }
    }, [text]);

    useEffect(() => {
        setTimeout(() => {
            inputRef.current?.focus();
        }, 10);
    }, []);

    return (
        <div
            style={{
                display: 'inline-block',
                color: `var(--${heading.color}-a11)`,
                fontSize: `var(--font-size-${heading.fontSize})`,
                lineHeight: `var(--line-height-${heading.fontSize})`,
                letterSpacing: `var(--letter-spacing-${heading.fontSize})`,
            }}
        >
            <span ref={spanRef} className={style.hiddenSpan}>
                {text}
            </span>
            <input
                ref={inputRef}
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={handleKeyDown}
                className={style.component}
                style={{ width: `${inputWidth}px` }}
                onBlur={() => onCancel()}
            />
        </div>
    );
};

export default HeadingEditInput;
