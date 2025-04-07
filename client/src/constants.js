export const Configs = {
    enviroment: process.env.NODE_ENV || "development",
    backend_url: process.env.REACT_APP_BACKEND_URL || "http://localhost:3001",
    backend_code: process.env.REACT_APP_BACKEND_CODE || "default_code",
    app_state: process.env.REACT_APP_APP_STATE || "block_edit",
    app_open: process.env.REACT_APP_APP_OPEN || "closed",
};
