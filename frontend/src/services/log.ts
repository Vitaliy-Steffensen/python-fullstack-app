import { Logtail } from '@logtail/browser';

const LOGTAIL_KEY = import.meta.env.VITE_BETTER_STACK_LOGGING_API_KEY;
const IS_PRODUCTION = import.meta.env.MODE === 'production';
const logtail = IS_PRODUCTION && LOGTAIL_KEY ? new Logtail(LOGTAIL_KEY) : null;

type LogLevels = 'info' | 'warn' | 'error' | 'debug';

type Logger = {
  [key in LogLevels]: (message: string, context?: object) => void;
};

const log: Logger = ['info', 'warn', 'error', 'debug'].reduce((logger, level) => {
  logger[level as LogLevels] = (message, context = {}) => {
    if (logtail) {
      logtail[level as LogLevels](message, context);
    } else {
      console[level as LogLevels](`[${level.toUpperCase()}]`, message, context);
    }
  };
  return logger;
}, {} as Logger);

export default log;
