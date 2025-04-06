const AppModel = require("../db/models/app");

const AppOpenMiddleware = (byPass = false) =>
    async function (req, res, next) {
        if (byPass) return next();
        const appData = await AppModel.findOne({});

        if (!appData || new Date(appData.openDate) > new Date()) {
            return res.status(403).json({ ok: false, error: "APP_NOT_OPEN" });
        }

        return next();
    };

module.exports = AppOpenMiddleware;
