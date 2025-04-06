require("dotenv").config();

const Configs = {
    port: process.env.PORT || 3001,
    code: Math.floor(Math.random() * 1000000),
    environment: process.env.NODE_ENV || "development",
    app_url: process.env.APP_URL || "http://localhost:3000",
    database: process.env.DATABASE || "mongodb://localhost:27017/my_ceremony",
    token_secret: process.env.TOKEN_SECRET || "local_token_secret",
    token_expire: process.env.TOKEN_EXPIRE || "365d",
    cors_origin: JSON.parse(process.env.CORS_ORIGIN || '["*"]')
};

module.exports = Configs;
