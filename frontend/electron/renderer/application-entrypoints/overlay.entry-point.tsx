import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import OverlayView from '@views/overlay.view';

const container = document.getElementById('root');
if (container === null) {
    throw new Error('Root container app not found, rendering failed.');
}

createRoot(container).render(
    <StrictMode>
        <OverlayView />
    </StrictMode>,
);