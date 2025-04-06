const express = require("express");
const Configs = require("./config");
const InitDatabase = require("./db");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const UserRouter = require("./module/user/user.routes");
const AppOpenMiddleware = require("./middleware/app-open");
const AppAdminMiddleware = require("./middleware/app-admin");

const code = Math.floor(Math.random()*1000000);

function main() {
    InitDatabase();

    const app = express();
    const port = Configs.port;
    const isProduction = Configs.environment === "prod";

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(
        cors({
            origin: "*",
            methods: ["GET", "POST", "PUT", "DELETE"],
        })
    );
    app.use(cookieParser());

    app.use(AppOpenMiddleware(!isProduction));
    app.use(AppAdminMiddleware())
    app.use("/u", UserRouter);

    app.get("/ping", (req, res) => {
        return res.json({ ok: true, status: 200 });
    });

    app.listen(port, () => {
        if (!isProduction) {
            console.log(`App listening at http://localhost:${port}`);
        } else {
            console.log("App running in Production");
        }

        console.log("AppAdminCode", code)
    });
}

main();
