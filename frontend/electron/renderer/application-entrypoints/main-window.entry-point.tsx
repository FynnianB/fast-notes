import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import MainWindowView from '@views/main-window/main-window.view';
import { HashRouter, Route, Routes } from 'react-router';
import DashboardView from '@views/dashboard/dashboard.view';
import { Theme } from '@radix-ui/themes';
import { Provider as ReduxProvider } from 'react-redux';
import { loadUserPreferences } from '@common/store/user-preferences.slice';
import '@radix-ui/themes/styles.css';
import '../../radix-overrides.css';
import { fetchNotes } from '@common/store/notes.slice';
import { handleIpc as handleNotesIpc } from '@common/api/notes.api';
import store from '../store';

const container = document.getElementById('root');
if (container === null) {
    throw new Error('Root container app not found, rendering failed.');
}

// Init IPC handlers
handleNotesIpc(store);

// Load initial data
store.dispatch(loadUserPreferences());
store.dispatch(fetchNotes());

createRoot(container).render(
    <StrictMode>
        <ReduxProvider store={store}>
            <Theme appearance="dark" scaling="95%">
                <HashRouter>
                    <Routes>
                        <Route element={<MainWindowView />}>
                            <Route index element={<DashboardView />} />
                            <Route path="categories">
                                <Route index element={<h1>Categories</h1>} />
                                <Route path="add" element={<h1>Add Category</h1>} />
                            </Route>
                            <Route path="settings" element={<h1>Settings</h1>} />
                        </Route>
                    </Routes>
                </HashRouter>
            </Theme>
        </ReduxProvider>
    </StrictMode>,
);
