const {
    getQrController, addController, getDataQrController, listController, updateController,
} = require("./user.controller");

const UserRouter = require("express").Router();

UserRouter.get("/qr/data", getDataQrController);
UserRouter.get("/qr", getQrController);
UserRouter.get("/", listController);

UserRouter.post("/", addController);

UserRouter.put("/:alias", updateController);

module.exports = UserRouter;
