import path from 'path';

import winston, { format, transports } from 'winston';

const { combine, timestamp, printf, colorize } = format;

// Define a custom format for the logs
const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level}]: ${stack || message}`;
});

const logger = winston.createLogger({
  // Use a sensible default log level
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',

  // Use the custom format
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    // Use errors format to print stack traces if available
    format.errors({ stack: true }),
    logFormat
  ),

  // Define where logs should go
  transports: [
    // 1. Log all messages to a file
    new transports.File({
      filename: path.join(process.cwd(), 'logs', 'app.log'),
      level: 'info', // Only store 'info' and higher in the file (less noise)
    }),

    // 2. Log all messages to the console
    new transports.Console({
      // Use colorize for terminal output
      format: combine(colorize(), logFormat),
      level: 'debug', // Log all 'debug' and higher to the terminal
    }),
  ],
});

export default logger;
