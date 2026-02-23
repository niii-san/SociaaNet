import dotenv from "dotenv";
dotenv.config({ quiet: true });

interface Env {
    port: number;
    sessionExpiryInMinutes: number;
    nodeEnv: string;
    file_service_url: string;
    file_service_internal_api_key: string;
    log_level: string;
    base_url: string;
    gmail_address: string;
    gmail_app_password: string;
}

export const env: Env = {
    port: parseInt(envRequired("PORT")),
    sessionExpiryInMinutes: parseInt(envRequired("SESSION_EXPIRY_IN_MINUTES")),
    nodeEnv: envRequired("NODE_ENV"),
    file_service_url: envRequired("FILE_SERVICE_URL"),
    file_service_internal_api_key: envRequired("FILE_SERVICE_INTERNAL_API_KEY"),
    log_level: envRequired("LOG_LEVEL"),
    base_url: envRequired("BASE_URL"),
    gmail_address: envRequired("GMAIL_ADDRESS"),
    gmail_app_password: envRequired("GMAIL_APP_PASSWORD")
};

export function envRequired(key: string) {
    const value = process.env[key];
    if (!value) {
        throw new Error(`Environment variable ${key} is required but not set.`);
    }
    return value;
}
