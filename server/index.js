const express = require("express");
const Configs = require("./config");
const InitDatabase = require("./db");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const UserRouter = require("./module/user/user.routes");
const AppOpenMiddleware = require("./middleware/app-open");
const cron = require("node-cron");

const isProduction = Configs.environment === "prod";

function main() {
    InitDatabase();

    const app = express();
    const port = Configs.port;

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(
        cors({
            origin: "*",
            methods: ["GET", "POST", "PUT", "DELETE"],
        })
    );
    app.use(cookieParser());

    app.use(AppOpenMiddleware(!isProduction));
    app.use("/u", UserRouter);

    app.get("/ping", (req, res) => {
        return res.json({ok: true, status: 200});
    });

    app.listen(port, () => {
        if (!isProduction) {
            console.log(`App listening at http://localhost:${port}`);
        } else {
            console.log("App running in Production");
        }

        console.log("AppAdminCode", Configs.code)
    });
}

main();

cron.schedule("*/14 * * * *", () => {
    if (!isProduction) return;
    fetch(`${Configs.app_url}/ping`).then(() => {
        console.log("Reload App");
    }).catch((e) => {
        console.error(e)
    });
});
