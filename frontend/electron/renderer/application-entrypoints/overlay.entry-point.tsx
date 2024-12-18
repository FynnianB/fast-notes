import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import OverlayView from '@views/overlay/overlay.view';
import { Theme } from '@radix-ui/themes';
import '@radix-ui/themes/styles.css';
import '../../radix-overrides.css';
import ErrorBoundary from '@common/components/error-boundary/error-boundary.component';
import logger from '@common/services/logger.service';

const container = document.getElementById('root');
if (container === null) {
    throw new Error('Root container app not found, rendering failed.');
}

createRoot(container).render(
    <StrictMode>
        <Theme appearance="dark" scaling="95%" hasBackground={false}>
            <ErrorBoundary>
                <OverlayView />
            </ErrorBoundary>
        </Theme>
    </StrictMode>,
);

window.onerror = (
    event: Event | string,
    source?: string,
    lineno?: number,
    colno?: number,
    error?: Error,
) => {
    const message = event instanceof Event ? event.type : event;
    logger.crit(message, {
        message,
        file: source,
        line: lineno,
        column: colno,
        stack: error ? error.stack : null,
    });
    return true;
};

// Catch resource loading errors and other errors not caught by window.onerror
// eslint-disable-next-line @typescript-eslint/no-explicit-any
window.addEventListener('error', (event: any) => {
    if (event instanceof ErrorEvent) {
        // Skip JavaScript errors that are already caught by window.onerror
        return true;
    }

    // Handle resource loading errors or other non-ErrorEvent errors
    logger.error('Resource loading error or other non-JS error', {
        target: event.target || event.srcElement,
        type: event.type,
        src: (event.target && (event.target as HTMLImageElement).src) || '',
    });
    return true;
}, true);

window.onunhandledrejection = (event: PromiseRejectionEvent) => {
    const errorMessage = typeof event.reason === 'object' && event.reason !== null && 'message' in event.reason
        ? (event.reason as Error).message
        : String(event.reason);

    const errorStack = typeof event.reason === 'object' && event.reason !== null && 'stack' in event.reason
        ? (event.reason as Error).stack
        : null;

    logger.crit('Unhandled promise rejection', {
        message: errorMessage,
        stack: errorStack,
    });
    return true;
};
