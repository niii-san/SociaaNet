import http from "http";
import app from "./app";
import { env } from "./config";
import { connectMongoDB } from "./utils";
import { setupSocketIO } from "./socket";

const server = http.createServer(app);

// Attach Socket.IO
setupSocketIO(server);

connectMongoDB()
    .then(() => {
        server.listen(env.port, () => {
            console.log(
                `SERVER RUNNING ON PORT: ${env.port}\nENVIRONMENT: ${env.nodeEnv}`
            );
        });
    })
    .catch((error) => {
        console.log(`SERVER FAILED TO RUN \nERROR: ${error}`);
    });
