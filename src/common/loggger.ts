import pino from 'pino';
import { config } from '#configs/index';

export const loggerSetting = {
  level: config.logLevel,
  formatters: {
    level: (label: string) => ({ level: label.toLocaleUpperCase() }),
  },
};

export const logger = pino(loggerSetting);
