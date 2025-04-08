const AppAdminMiddleware = (adminCode) => (req, res, next) => {
    const { code } = req.headers;

    if (!adminCode) next();

    if (!code || code !== adminCode.toString())
        return res.status(403).json({ ok: false, error: "NOT_ADMIN" });

    return next();
};

module.exports = AppAdminMiddleware;
