import { defineConfig } from 'vite';
import path from 'path';

// https://vitejs.dev/config
export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                main_window: path.resolve(__dirname, 'main_window.html'),
                overlay: path.resolve(__dirname, 'overlay.html'),
            },
        },
    },
    resolve: {
        alias: {
            '@common': path.resolve(__dirname, 'renderer/common'),
            '@modules': path.resolve(__dirname, 'renderer/modules'),
            '@views': path.resolve(__dirname, 'renderer/views'),
        },
    }
});
