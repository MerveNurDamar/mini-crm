const { createLogger, transports, format } = require('winston');

const logLevel = process.env.LOG_LEVEL || 'info';
const logFormat = process.env.LOG_FORMAT || 'json';

const baseFormat = format.combine(format.timestamp(), format.errors({ stack: true }));
const jsonFormat = format.combine(baseFormat, format.json());
const textFormat = format.combine(
  baseFormat,
  format.printf(({ level, message, timestamp, stack, ...meta }) => {
    const metaString = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
    if (stack) {
      return `${timestamp} [${level}] ${message} - ${stack}${metaString}`;
    }
    return `${timestamp} [${level}] ${message}${metaString}`;
  })
);

const logger = createLogger({
  level: logLevel,
  format: logFormat === 'text' ? textFormat : jsonFormat,
  transports: [new transports.Console()],
});

module.exports = logger;
