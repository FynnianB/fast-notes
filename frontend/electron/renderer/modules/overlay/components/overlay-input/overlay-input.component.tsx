import { useState } from 'react';
import { addNote, closeOverlay } from '@modules/overlay/api/overlay.api';
import { Button } from '@radix-ui/themes';
import MarkdownEditor from '@common/components/markdown-editor/markdown-editor.component';
import { useStateRef } from '@common/hooks/react.hooks';
import style from './overlay-input.module.less';

const OverlayInput = () => {
    const [, setNote, noteRef] = useStateRef('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (noteRef.current.trim().length <= 0) return;
        setLoading(true);
        const success = await addNote(noteRef.current);
        if (success) {
            await closeOverlay();
        }
        setLoading(false);
    };

    return (
        <div className={style.component}>
            <MarkdownEditor
                initialText=""
                onChange={(value) => setNote(value)}
                onKeyUp={(event) => {
                    if (event.ctrlKey && event.key === 'Enter') {
                        handleSubmit().then();
                    }
                }}
                fixFullHeight={true}
            />
            <div className={style.saveButton}>
                <Button color="indigo" size="2" variant="soft" radius="large" onClick={handleSubmit} loading={loading}>Save</Button>
            </div>
        </div>
    );
};

export default OverlayInput;
