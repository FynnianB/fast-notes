import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import OverlayView from '@views/overlay/overlay.view';
import { Theme } from '@radix-ui/themes';
import '@radix-ui/themes/styles.css';
import '../../radix-overrides.css';

const container = document.getElementById('root');
if (container === null) {
    throw new Error('Root container app not found, rendering failed.');
}

createRoot(container).render(
    <StrictMode>
        <Theme appearance="dark" scaling="95%" hasBackground={false}>
            <OverlayView />
        </Theme>
    </StrictMode>,
);
