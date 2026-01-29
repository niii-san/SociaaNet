import dotenv from "dotenv";
dotenv.config({ quiet: true });

interface Env {
    port: number;
    nodeEnv: string;
    internalApiKey: string;
}

const env: Env = {
    port: Number(process.env.PORT) || 8001,
    nodeEnv: process.env.NODE_ENV || "development",
    internalApiKey: process.env.INTERNAL_API_KEY || ""
};

export default env;
