import style from './overlay-input.module.less';
import React, { FormEvent, useEffect, useRef, useState } from 'react';
import { addNote, closeOverlay, increaseOverlayHeightBy } from '@modules/overlay/api/overlay.api';
import { Button, TextArea } from '@radix-ui/themes';

const OverlayInput = () => {
    const [note, setNote] = useState('');
    const [height, setHeight] = useState(0);
    const [loading, setLoading] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleSubmit = async () => {
        if (note.trim().length <= 0) return;
        setLoading(true);
        const success = await addNote(note);
        if (success) {
            await closeOverlay();
        }
        setLoading(false);
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
        <div className={style.component}>
            <TextArea
                placeholder="Enter your note here..."
                value={note}
                variant="surface"
                onInput={handleInput}
                onKeyUp={handleKeyUp}
                autoFocus
                size="3"
                ref={textareaRef}
                className={style.textArea}
            />
            <div className={style.saveButton}>
                <Button color="indigo" size="2" variant="soft" radius="large" onClick={handleSubmit} loading={loading}>Save</Button>
            </div>
        </div>
    )
};

export default OverlayInput;