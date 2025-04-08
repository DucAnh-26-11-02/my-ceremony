const Configs = require("../../config");
const streamifier = require("streamifier");

const cloudinary = require("cloudinary").v2;

cloudinary.config({
    cloud_name: Configs.cloudinary_cloud_name,
    api_key: Configs.cloudinary_api_key,
    api_secret: Configs.cloudinary_secret_key,
});

const imageUpload = async (file) => {
    try {
        const uploadResult = await new Promise((resolve, reject) => {
            const steam = cloudinary.uploader.upload_stream(
                {
                    folder: "uploads",
                    resource_type: "auto",
                    use_filename: true,
                    unique_filename: true,
                    overwrite: true,
                },
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result);
                }
            );

            streamifier.createReadStream(file.buffer).pipe(steam);
        });

        delete uploadResult.api_key;

        return {
            status: 200,
            message: "Image uploaded successfully",
            data: {
                public_id: uploadResult.public_id,
                url: uploadResult.url,
                format: uploadResult.format,
                resource_type: uploadResult.resource_type,
                secure_url: uploadResult.secure_url,
                original_filename: uploadResult.original_filename,
            },
        };
    } catch (e) {
        console.error(e);
        return {
            status: 500,
            message: "Image upload failed",
        };
    }
};

const imageRemove = async (publicId) => {
    try {
        const result = await cloudinary.uploader.destroy(publicId, {
            resource_type: "image",
        });

        if (result.result === "ok") {
            return {
                status: 200,
                message: "Image deleted successfully",
            };
        } else {
            return {
                status: 400,
                message: "Failed to delete image",
                data: result,
            };
        }
    } catch (e) {
        console.error(e);
        return {
            status: 500,
            message: "Image remove failed",
        };
    }
};

const MediaService = { imageUpload, imageRemove };

module.exports = MediaService;
