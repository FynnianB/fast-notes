import { ipcMain } from 'electron';
import type { RendererLog } from '../../@types/logging.type';
import rendererLogger from '../services/logger-renderer.service';

const handleIpc = () => {
    ipcMain.handle('electron/log', async (_event, log: RendererLog): Promise<void> => {
        rendererLogger[log.level](log);
    });
}

export default handleIpc;
