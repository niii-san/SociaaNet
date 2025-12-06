import app from "./app";
import config from "./config/config";
import { connectMongoDB } from "./utils";

connectMongoDB()
    .then(() => {
        app.listen(config.port, () => {
            console.log(
                `SERVER RUNNING ON PORT: ${config.port}\nENVIRONMENT: ${config.nodeEnv}`
            );
        });
    })
    .catch((error) => {
        console.log(`SERVER FAILED TO RUN \nERROR: ${error}`);
    });
