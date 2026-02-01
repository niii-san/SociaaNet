import dotenv from "dotenv";
dotenv.config({ quiet: true });

interface Env {
    port: number;
    nodeEnv: string;
    internalApiKey: string;
    log_level: string;
}

const env: Env = {
    port: Number(process.env.PORT) || 8001,
    nodeEnv: process.env.NODE_ENV || "development",
    internalApiKey: process.env.INTERNAL_API_KEY || "",
    log_level: process.env.LOG_LEVEL || "info"
};

export default env;
