const {
    getQrController,
    addController,
    getDataQrController,
    listController,
    updateController,
    removeController,
} = require("./user.controller");
const AppAdminMiddleware = require("../../middleware/app-admin");
const Configs = require("../../config");

const UserRouter = require("express").Router();

UserRouter.get(
    "/qr/data",
    (req, res, next) => {
        const { alias, code } = req;
        console.log(`${alias || ""}:${code || ""} is getting data!`);
        next();
    },
    getDataQrController
);
UserRouter.get("/qr", AppAdminMiddleware(Configs.code), getQrController);
UserRouter.get("/", AppAdminMiddleware(Configs.code), listController);

UserRouter.post("/", AppAdminMiddleware(Configs.code), addController);

UserRouter.put("/:alias", AppAdminMiddleware(Configs.code), updateController);
UserRouter.delete(
    "/:alias",
    AppAdminMiddleware(Configs.code),
    removeController
);

module.exports = UserRouter;
