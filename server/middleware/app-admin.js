const AppAdminMiddleware = (adminCode) => (req, res, next) => {
    const { code } = req.headers;

    if(!code || code !== adminCode)
    return res.status(403).json({ok: false, error: "NOT_ADMIN"});

    return next();
}

module.exports = AppAdminMiddleware;