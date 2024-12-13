import style from './overlay-input.module.less';
import React, { FormEvent, useEffect, useRef, useState } from 'react';
import { addNote, closeOverlay, increaseOverlayHeightBy } from '@modules/overlay/api/overlay.api';
import { TextArea } from '@radix-ui/themes';

const OverlayInput = () => {
    const [note, setNote] = useState('');
    const [height, setHeight] = useState(0);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleSubmit = async () => {
        if (note.trim().length <= 0) return;
        console.log('Saving note:', note);
        const success = await addNote(note);
        if (success) {
            await closeOverlay();
        }
    };

    const handleKeyUp = async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && e.ctrlKey) {
            e.preventDefault();
            await handleSubmit();
        }
    };

    const handleInput = async (e: FormEvent<HTMLTextAreaElement>) => {
        setNote(e.currentTarget.value);
        if (textareaRef.current) {
            const newHeight = textareaRef.current.scrollHeight;
            if (newHeight > height && newHeight < 500) { // prevent unnecessary ipc calls
                await increaseOverlayHeightBy(newHeight - height);
                setHeight(newHeight);
            }
        }
    }

    useEffect(() => {
        if (textareaRef.current) {
            setHeight(textareaRef.current.scrollHeight);
        }
    }, []);

    return (
        <TextArea
            placeholder="Enter your note here..."
            value={note}
            variant="surface"
            onInput={handleInput}
            onKeyUp={handleKeyUp}
            className={style.component}
            autoFocus
            size="3"
            ref={textareaRef}
        />
    )
};

export default OverlayInput;