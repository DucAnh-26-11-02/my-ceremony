const MediaService = require("./media.service");

const imageUpload = async (req, res) => {
    const file = req.file;

    const cloudUploaded = await MediaService.imageUpload(file);

    return res.status(cloudUploaded.status).json(cloudUploaded);
};

const imageRemove = async (req, res) => {
    const { publicId } = req.body;

    const cloudRemoved = await MediaService.imageRemove(publicId);

    return res.status(cloudRemoved.status).json(cloudRemoved);
};

const MediaController = { imageUpload, imageRemove };

module.exports = MediaController;
