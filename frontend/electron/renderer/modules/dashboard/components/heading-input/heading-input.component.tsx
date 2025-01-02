import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import { useCanvasService } from '@modules/dashboard/services/canvas.service';
import style from './heading-input.module.less';
import { UiColor } from '../../../../../main/enumerations/UiColor.enumeration';

interface HeadingInputProps {
    position: { x: number, y: number };
    onSubmit: (text: string) => void;
    onCancel: () => void;
}

const HeadingInput = ({
    position,
    onSubmit,
    onCancel,
}: HeadingInputProps) => {
    const { addHeading } = useCanvasService();
    const [text, setText] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            const adjustedX = position.x - 8;
            const adjustedY = position.y - (inputRef.current?.offsetHeight ?? 0) * 0.5;
            addHeading({
                text: text.trim(),
                fontSize: 7,
                color: UiColor.INDIGO,
                x: adjustedX,
                y: adjustedY,
            }).then(() => {
                onSubmit(text.trim());
            });
        } else if (event.key === 'Escape') {
            onCancel();
        } else if (inputRef.current) {
            const { scrollWidth } = inputRef.current;
            inputRef.current.style.width = `${scrollWidth}px`;
        }
    };

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    return (
        <input
            ref={inputRef}
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            className={style.component}
            style={{
                left: position.x,
                top: position.y,
            }}
            onBlur={() => onCancel()} // Close input box if user clicks outside
        />
    );
};

export default HeadingInput;
