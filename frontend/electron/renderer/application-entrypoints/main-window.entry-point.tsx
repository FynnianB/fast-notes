import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import DashboardView from '@views/dashboard.view';

const container = document.getElementById('root');
if (container === null) {
    throw new Error('Root container app not found, rendering failed.');
}

// Todo: Router setup
createRoot(container).render(
    <StrictMode>
        <DashboardView />
    </StrictMode>,
);