import { defineConfig } from 'vite';
import native from 'vite-plugin-native';
import InlineMigrationsVitePlugin from './InlineMigrationsVitePlugin';

// https://vitejs.dev/config
export default defineConfig({
    build: {
        sourcemap: process.env.NODE_ENV === 'development',
    },
    plugins: [
        InlineMigrationsVitePlugin(),
        native({
            webpack: {}
        })
    ],
});
