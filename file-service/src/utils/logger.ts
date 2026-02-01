// src/utils/logger.ts
import pino from "pino";
import env from "../config/env";

const transport = pino.transport({
    target: "pino-pretty",
    level: env.log_level,
    options: { colorize: true, translateTime: "yyyy-mm-dd HH:MM:ss.l o" },
    levels: { fatal: 60, error: 50, warn: 40, info: 30, debug: 20, trace: 10 }
});

export const logger = pino(transport);

