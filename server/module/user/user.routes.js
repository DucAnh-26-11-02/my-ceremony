const {
    getQrController, addController, getDataQrController, listController, updateController,
} = require("./user.controller");
const AppAdminMiddleware = require("../../middleware/app-admin")
const Configs = require("../../config");

const UserRouter = require("express").Router();

UserRouter.get("/qr/data", getDataQrController);
UserRouter.get("/qr", AppAdminMiddleware(Configs.code), getQrController);
UserRouter.get("/", AppAdminMiddleware(Configs.code), listController);

UserRouter.post("/", AppAdminMiddleware(Configs.code), addController);

UserRouter.put("/:alias", AppAdminMiddleware(Configs.code), updateController);

module.exports = UserRouter;
