const {
    getQrController,
    addController,
    getDataQrController,
} = require("./user.controller");

const UserRouter = require("express").Router();

UserRouter.get("/qr/data", getDataQrController);
UserRouter.post("/", addController);
UserRouter.get("/qr", getQrController);

UserRouter.post("/", addController);
UserRouter.post("/", addController);

module.exports = UserRouter;
