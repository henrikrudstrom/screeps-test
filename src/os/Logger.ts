import log from "loglevel"
import prefix from "loglevel-plugin-prefix";

prefix.reg(log);

prefix.apply(log, {
  format(level, name) {
    return `[T: ${Game.time}] [${level}] [${name}]`;
  },
});


export function createLogger(moduleName: string, level: log.LogLevelDesc='INFO') : log.Logger{
  const logger =  log.getLogger(moduleName);
  logger.setLevel(level);
  return logger;
}

export function setLogLevel(level: log.LogLevelDesc, ...loggers: string[]){
  loggers.forEach((loggerName) => {
    log.getLogger(loggerName).setLevel(level)
  })

}
