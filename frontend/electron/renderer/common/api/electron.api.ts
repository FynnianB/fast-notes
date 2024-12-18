import type { RendererLog } from '../../../@types/logging.type';

export const log = async (logEntry: RendererLog): Promise<void> => window.sharedApi.log(logEntry);
