const Configs = require("../../config");
const AppAdminMiddleware = require("../../middleware/app-admin");
const MediaController = require("./media.controller");
const multer = require("multer");
const MediaRouter = require("express").Router();
const upload = multer();

MediaRouter.post(
    "/image/upload",
    AppAdminMiddleware(Configs.code),
    upload.single("file"),
    MediaController.imageUpload
);
MediaRouter.delete(
    "/image/remove",
    AppAdminMiddleware(Configs.code),
    MediaController.imageRemove
);

module.exports = MediaRouter;
