const { getQr, add, getDataQr, update, list } = require("./user.service");

async function getQrController(req, res, next) {
    const { alias } = req.query;

    const getQrService = await getQr({ alias });

    if (getQrService.ok) {
        return res.send(`<img src="${getQrService.data}" alt="qr_${alias}" />`);
    }

    return res.status(getQrService.status).json(getQrService);
}

async function getDataQrController(req, res, next) {
    const { alias, code } = req.query;

    const getQrService = await getDataQr({ alias, code });

    return res.status(getQrService.status).json(getQrService);
}

async function addController(req, res, next) {
    const { alias, name } = req.body;

    const addUserService = await add({ alias, name });

    return res.status(addUserService.status).json(addUserService);
}

async function listController(req, res, next) {
    const listUsers = await list();

    return res.status(listUsers.status).json(listUsers);
}

async function updateController(req, res, next) {
    const { alias } = req.params;
    const { name, invitationCards, contents } = req.body;

    const updateUserService = await update({
        alias,
        name,
        invitationCards,
        contents,
    });

    return res.status(updateUserService.status).json(updateUserService);
}

module.exports = {
    getQrController,
    addController,
    getDataQrController,
    listController,
    updateController,
};
