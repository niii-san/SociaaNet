import app from "./app"
import config from "./config/config"

app.listen(config.port, () => {
    console.log(
        `SERVER RUNNING ON PORT: ${config.port}\nENVIRONMENT: ${config.nodeEnv}`,
    );
});


