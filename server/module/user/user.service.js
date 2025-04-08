const UserModel = require("../../db/models/user");
const slugify = require("slugify");
const QrCode = require("qrcode");
const Configs = require("../../config");

async function list() {
    const [items, count] = await Promise.all([
        UserModel.find({}),
        UserModel.countDocuments({}),
    ]);

    return { ok: true, status: 200, data: { items, count } };
}

async function checkExist({ error = "e", alias, code = null }) {
    const aliasSlug = slugify(alias || "", {
        lower: true,
        trim: true,
        replacement: "-",
    });

    const aliasCheck = await UserModel.findOne({
        alias: aliasSlug,
        ...(!!code ? { code } : {}),
    });

    if (!error)
        return { ok: false, status: 501, error: "INVALID_ERROR_TYPE_USER" };

    if (error === "ne" && !aliasCheck)
        return { ok: false, status: 404, error: "NOT_EXIST_USER" };

    if (error === "e" && !!aliasCheck)
        return { ok: false, status: 400, error: "EXISTED_USER" };

    return {
        ok: true,
        alias: aliasSlug,
        user: aliasCheck,
    };
}

async function getDataQr({ alias, code }) {
    const aliasCheck = await checkExist({ error: "ne", alias, code });
    if (!aliasCheck?.ok) return aliasCheck;

    const userData = aliasCheck.user.toObject();

    const { ...returnData } = userData;

    return {
        ok: true,
        status: 200,
        data: returnData,
    };
}

async function getQr({ alias }) {
    const aliasCheck = await checkExist({ error: "ne", alias });
    if (!aliasCheck?.ok) return aliasCheck;

    return { ok: true, status: 200, data: aliasCheck.user.invitationQr };
}

async function add({ name, alias }) {
    const aliasCheck = await checkExist({ error: "e", alias });
    if (!aliasCheck?.ok) return aliasCheck;

    try {
        const userCode = Date.now();
        const userAlias = aliasCheck.alias;

        const qrURl = `${Configs.frontend_url}/qr?alias=${userAlias}&code=${userCode}`;

        const userInvitaionQr = await QrCode.toDataURL(qrURl, {
            errorCorrectionLevel: "H",
            rendererOpts: {
                quality: 1,
            },
            color: {
                dark: "#060A52",
                light: "#ffffff",
            },
            margin: 2,
            maskPattern: 0,
        });

        const userInstance = await UserModel.create({
            name,
            alias: userAlias,
            code: userCode,
            invitationQr: userInvitaionQr,
            invitationCards: [],
            contents: [],
        });

        await userInstance.save();

        return {
            ok: true,
            status: 200,
        };
    } catch (err) {
        console.log(err);
        return { ok: false, status: 500 };
    }
}

async function update({ alias, name, invitationCards, contents }) {
    const aliasCheck = await checkExist({ error: "ne", alias });
    if (!aliasCheck?.ok) return aliasCheck;

    const newUser = {
        ...aliasCheck.user.toObject(),
        alias,
        name,
        invitationCards,
        contents,
    };

    await UserModel.findOneAndUpdate({ alias }, newUser);

    return { ok: true, status: 200 };
}

module.exports = {
    getQr,
    add,
    getDataQr,
    list,
    update,
};
