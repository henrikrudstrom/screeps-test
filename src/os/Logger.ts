import log from "loglevel"

export function createLogger(moduleName: string, level: log.LogLevelDesc='INFO') : log.Logger{
  const logger =  log.getLogger(moduleName);
  logger.setLevel(level);
  return logger;
}
