// src/utils/logger.ts
import pino from "pino";
import env from "../config/env";

const transport = pino.transport({
    target: "pino-pretty",
    level: env.log_level,
    options: { colorize: true, translateTime: "yyyy-mm-dd HH:MM:ss.l o" }
});

export const logger = pino(transport);
