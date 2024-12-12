import style from './overlay-input.module.less';
import { useState } from 'react';
import { addNote, closeOverlay } from '@modules/overlay/api/overlay.api';

const OverlayInput = () => {
    const [note, setNote] = useState('');
    const [error, setError] = useState(false);

    const handleSubmit = async () => {
        if (note.length <= 0) return;
        setError(false);
        const success = await addNote(note);
        if (!success) {
            setError(true);
            return;
        }
        await closeOverlay();
    };

    return (
        <div className={style.component}>
            {error && <p>An error occurred while saving. Try again</p>}
            <label>Insert new Note:</label>
            <input type="text" value={note} onChange={e => setNote(e.target.value)}/>
            <button onClick={handleSubmit}>Insert</button>
        </div>
    )
};

export default OverlayInput;