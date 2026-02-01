import { app } from "./app";
import env from "./config/env";

app.listen(env.port, () => {
    console.log(`file_service microservice running on port ${env.port}`);
});
