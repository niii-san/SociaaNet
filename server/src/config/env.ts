import dotenv from "dotenv";
dotenv.config({ quiet: true });

interface Env {
    port: number;
    nodeEnv: string;
    file_service_url: string;
    file_service_internal_api_key: string;
    log_level?: string;
    base_url: string;
}

export const env: Env = {
    port: Number(process.env.PORT) || 8000,
    nodeEnv: process.env.NODE_ENV || "development",
    file_service_url: process.env.FILE_SERVICE_URL || "http://localhost:8001",
    file_service_internal_api_key:
        process.env.FILE_SERVICE_INTERNAL_API_KEY || "xxxx",
    log_level: process.env.LOG_LEVEL || "info",
    base_url: process.env.BASE_URL || "http://localhost:8000"
};
