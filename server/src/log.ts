import { log } from "./deps.ts";

export const configureLogger = async (loggerName: string) => {
  await log.setup({
    handlers: {
      baseFmt: new log.handlers.ConsoleHandler("INFO", {
        formatter: (logRecord) => {
          const date = getDate();
          return `${date} - [${loggerName}] [${logRecord.levelName}] ${logRecord.msg}`;
        },
      }),
    },

    loggers: {
      default: {
        level: "INFO",
        handlers: ["baseFmt"],
      },
    },
  });
};

const getDate = () => {
  const date = new Date();
  return `${formatNumber(date.getDate())}/${formatNumber(date.getMonth() + 1)}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
};

const formatNumber = (number: number) => {
  return ("0" + number).slice(-2);
};

// Test