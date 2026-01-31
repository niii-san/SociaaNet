import app from "./app";
import { env } from "./config";
import { connectMongoDB } from "./utils";

connectMongoDB()
    .then(() => {
        app.listen(env.port, () => {
            console.log(
                `SERVER RUNNING ON PORT: ${env.port}\nENVIRONMENT: ${env.nodeEnv}`
            );
        });
    })
    .catch((error) => {
        console.log(`SERVER FAILED TO RUN \nERROR: ${error}`);
    });
