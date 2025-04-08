require("dotenv").config();

const Configs = {
    port: process.env.PORT || 3001,
    code: process.env.ADMIN_CODE || null,
    environment: process.env.NODE_ENV || "development",
    app_url: process.env.APP_URL || "http://localhost:3001",
    frontend_url: process.env.FRONTEND_URL || "http://localhost:300",
    database: process.env.DATABASE || "mongodb://localhost:27017/my_ceremony",
    token_secret: process.env.TOKEN_SECRET || "local_token_secret",
    token_expire: process.env.TOKEN_EXPIRE || "365d",
    cors_origin: JSON.parse(process.env.CORS_ORIGIN || '["*"]'),
    cloudinary_api_key: process.env.CLOUDINARY_API_KEY || "cloudinary_secret",
    cloudinary_secret_key:
        process.env.CLOUDINARY_SECRET_KEY || "cloudinary_key",
    cloudinary_cloud_name:
        process.env.CLOUDINARY_CLOUD_NAME || "cloudinary_name",
};

module.exports = Configs;
