import { useRef, useState } from "react";
import { Configs } from "../constants";
import { LoaderCircle, Plus, Trash, Upload } from "lucide-react";

const CREATE_INVITATION_CARD_STATE = {
    OPEN_FORM: "OPEN",
    CLOSE_FORM: "CLOSE",
    CANCELLING: "CANCELLING",
    CREATING_FORM: "CREATING",
    CREATE_FORM: "CREATE",
};

const UPLOAD_STATE = {
    IDLE: "IDLE",
    UPLOADING: "UPLOADING",
    UPLOAD_ERROR: "UPLOAD_ERROR",
    UPLOADED: "UPLOADED",
    DELETING: "DELETING",
    DELETE_ERROR: "DELETE_ERROR",
    DELETED: "DELETED",
};

export default function CreateInvitationCard({ onCreateConfirm }) {
    const [formData, setFormData] = useState({
        name: "",
        front: null,
        back: null,
    });
    const [imageUpload, setImageUpload] = useState({
        front: null,
        back: null,
    });
    const [state, setState] = useState(CREATE_INVITATION_CARD_STATE.CLOSE_FORM);
    const [uploadState, setUploadState] = useState({
        front: UPLOAD_STATE.IDLE,
        back: UPLOAD_STATE.IDLE,
    });
    const frontRef = useRef();
    const backRef = useRef();

    const resetForm = () => {
        setFormData({
            name: "",
            front: null,
            back: null,
        });
        setImageUpload({
            front: null,
            back: null,
        });
        setUploadState({
            front: UPLOAD_STATE.IDLE,
            back: UPLOAD_STATE.IDLE,
        });
        setState(CREATE_INVITATION_CARD_STATE.CLOSE_FORM);
    };

    const handleClickRemove = (type) => async () => {
        if (!imageUpload[type]) return;

        await handleRemoveImage(imageUpload[type], type);
        setImageUpload((prev) => ({ ...prev, [type]: null }));
        setFormData((prev) => ({
            ...prev,
            [type]: null,
        }));
    };

    const handleClickUpload = (type) => () => {
        switch (type) {
            case "front":
                frontRef.current?.click();
                break;
            case "back":
                backRef.current?.click();
                break;
            default:
                break;
        }
    };

    const handleUploadImage = async (file, type) => {
        setUploadState((prev) => ({ ...prev, [type]: UPLOAD_STATE.UPLOADING }));
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch(`${Configs.backend_url}/media/image/upload`, {
            method: "POST",
            headers: {
                code: Configs.backend_code,
            },
            body: formData,
        });

        if (!res.ok) {
            setUploadState((prev) => ({
                ...prev,
                [type]: UPLOAD_STATE.UPLOAD_ERROR,
            }));
            return null;
        }

        const data = await res.json();
        setUploadState((prev) => ({ ...prev, [type]: UPLOAD_STATE.UPLOADED }));
        return data.data;
    };

    const handleRemoveImage = async (image, type) => {
        if (!image) return null;
        setUploadState((prev) => ({ ...prev, [type]: UPLOAD_STATE.DELETING }));

        const res = await fetch(`${Configs.backend_url}/media/image/remove`, {
            method: "DELETE",
            headers: {
                "Content-type": "application/json",
                code: Configs.backend_code,
            },
            body: JSON.stringify({
                publicId: image.public_id,
            }),
        });

        if (!res.ok) {
            setUploadState((prev) => ({
                ...prev,
                [type]: UPLOAD_STATE.DELETE_ERROR,
            }));
            return null;
        }

        setUploadState((prev) => ({ ...prev, [type]: UPLOAD_STATE.DELETED }));

        return true;
    };

    const handleChangeState = (state) => () => {
        setState(state);

        switch (state) {
            case CREATE_INVITATION_CARD_STATE.OPEN_FORM:
                setFormData({
                    name: "",
                    front: "",
                    back: "",
                });
                return;

            case CREATE_INVITATION_CARD_STATE.CLOSE_FORM:
                return;

            case CREATE_INVITATION_CARD_STATE.CREATE_FORM:
                handleCreateConfirm();
                return;

            default:
                return;
        }
    };

    const handleChangeName = (e) => {
        setFormData((prev) => ({
            ...prev,
            name: e.target.value,
        }));
    };

    const handleChangeImage = (type) => async (e) => {
        const file = e.target.files[0];
        e.target.value = null;

        if (imageUpload[type]) {
            await handleRemoveImage(imageUpload[type], type);
        }

        const uploaded = await handleUploadImage(file, type);

        switch (type) {
            case "front":
                setImageUpload((prev) => ({ ...prev, front: uploaded }));
                setFormData((prev) => ({
                    ...prev,
                    front: uploaded,
                }));
                break;
            case "back":
                setImageUpload((prev) => ({ ...prev, back: uploaded }));
                setFormData((prev) => ({
                    ...prev,
                    back: uploaded,
                }));
                break;

            default:
                break;
        }
    };

    const handleCancelCreate = () => {
        setState(CREATE_INVITATION_CARD_STATE.CANCELLING);
        Promise.all([
            handleRemoveImage(imageUpload.front, "front"),
            handleRemoveImage(imageUpload.back, "back"),
        ]).then(() => {
            resetForm();
        });
    };

    const handleCreateConfirm = () => {
        onCreateConfirm(formData);
        resetForm();
    };

    return (
        <div>
            <div className="mb-4 w-full">
                <button
                    className="flex items-center gap-2 box-border h-fit p-2 px-5 border border-slate-200 dark:border-slate-500 rounded-md bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600 duration-100 w-full justify-center"
                    onClick={handleChangeState(
                        CREATE_INVITATION_CARD_STATE.OPEN_FORM
                    )}
                >
                    <Plus size={15} /> Create
                </button>
            </div>
            {[
                CREATE_INVITATION_CARD_STATE.OPEN_FORM,
                CREATE_INVITATION_CARD_STATE.CANCELLING,
                CREATE_INVITATION_CARD_STATE.CREATING_FORM,
            ].includes(state) && (
                <div className="h-fit flex flex-col gap-5 w-full box-border p-5 border border-slate-200 dark:border-slate-500 rounded-lg bg-white dark:bg-slate-700">
                    <div className="w-full overflow-hidden">
                        <input
                            type="text"
                            placeholder="Card Name"
                            value={formData.name}
                            onChange={handleChangeName}
                            className="w-full bg-transparent border rounded-sm p-2 px-3 box-border border-slate-200 dark:border-slate-500 focus:outline-none focus:ring-none focus:ring-transparent focus:border-slate-500 dark:focus:border-sate-200 text-sm duration-100"
                        />
                    </div>

                    <div className="rounded-md box-border w-full h-fit gap-5 grid grid-cols-2 duration-75">
                        <div className="rounded-lg bg-slate-50 dark:bg-slate-900 overflow-hidden w-full hover:shadow-xl hover:border-slate-700 dark:hover:border-white box-border border-slate-200 border hover:cursor-pointer duration-100 shadow-none group min-h-[120px] md:min-h-[200px] relative flex items-center justify-center">
                            {!!formData.front && (
                                <img
                                    src={formData.front?.url}
                                    alt="Ceremony Invitation Front"
                                    className="w-full h-auto object-contain group-hover:scale-105 duration-100"
                                />
                            )}
                            {uploadState.front === UPLOAD_STATE.UPLOADING && (
                                <div className="absolute top-0 left-0 z-20 w-full h-full flex items-center justify-center bg-slate-800/50 text-slate-800 dark:text-white">
                                    <LoaderCircle
                                        size={25}
                                        className="animate-spin"
                                    />
                                </div>
                            )}
                            <div className="absolute z-10 top-0 left-0 w-full h-full hidden items-center justify-center gap-3 group-hover:flex bg-slate-900/50">
                                <input
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    size="2mb"
                                    ref={frontRef}
                                    onChange={handleChangeImage("front")}
                                />
                                <button
                                    className="flex items-center gap-1 bg-white text-slate-800 p-2 px-5 text-sm rounded-md hover:bg-slate-200 "
                                    onClick={handleClickUpload("front")}
                                    disabled={
                                        uploadState.back ===
                                        UPLOAD_STATE.UPLOADING
                                    }
                                >
                                    {uploadState.front ===
                                    UPLOAD_STATE.UPLOADING ? (
                                        <LoaderCircle
                                            size={15}
                                            className="animate-spin"
                                        />
                                    ) : (
                                        <Upload size={15} />
                                    )}
                                    Select
                                </button>
                                {!!formData.front && (
                                    <>
                                        <button
                                            className="flex items-center gap-1 bg-red-800 text-slate-50 p-2 px-5 text-sm rounded-md hover:bg-red-900 "
                                            onClick={handleClickRemove("front")}
                                            disabled={
                                                uploadState.back ===
                                                UPLOAD_STATE.DELETING
                                            }
                                        >
                                            {uploadState.front ===
                                            UPLOAD_STATE.DELETING ? (
                                                <LoaderCircle
                                                    size={15}
                                                    className="animate-spin"
                                                />
                                            ) : (
                                                <Trash size={15} />
                                            )}
                                            Remove
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                        <div className="rounded-lg bg-slate-50 dark:bg-slate-900 overflow-hidden w-full hover:shadow-xl hover:border-slate-700 dark:hover:border-white box-border border-slate-200 border hover:cursor-pointer duration-100 shadow-none group min-h-[120px] md:min-h-[200px] relative flex items-center justify-center">
                            {!!formData.back && (
                                <img
                                    src={formData.back?.url}
                                    alt="Ceremony Invitation Back"
                                    className="w-full h-auto object-contain group-hover:scale-105 duration-100"
                                />
                            )}
                            {uploadState.back === UPLOAD_STATE.UPLOADING && (
                                <div className="absolute top-0 left-0 z-20 w-full h-full flex items-center justify-center bg-slate-800/50 text-slate-800 dark:text-white">
                                    <LoaderCircle
                                        size={25}
                                        className="animate-spin"
                                    />
                                </div>
                            )}
                            <div className="absolute z-10 top-0 left-0 w-full h-full hidden items-center justify-center gap-3 group-hover:flex bg-slate-900/50">
                                <input
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    size="2mb"
                                    ref={backRef}
                                    onChange={handleChangeImage("back")}
                                />
                                <button
                                    className="flex items-center gap-1 bg-white text-slate-800 p-2 px-5 text-sm rounded-md hover:bg-slate-200 "
                                    onClick={handleClickUpload("back")}
                                    disabled={
                                        uploadState.back ===
                                        UPLOAD_STATE.UPLOADING
                                    }
                                >
                                    {uploadState.back ===
                                    UPLOAD_STATE.UPLOADING ? (
                                        <LoaderCircle
                                            size={15}
                                            className="animate-spin"
                                        />
                                    ) : (
                                        <Upload size={15} />
                                    )}
                                    Select
                                </button>
                                {!!formData.back && (
                                    <>
                                        <button
                                            disabled={
                                                uploadState.back ===
                                                UPLOAD_STATE.DELETING
                                            }
                                            className="flex items-center gap-1 bg-red-800 text-slate-50 p-2 px-5 text-sm rounded-md hover:bg-red-900 "
                                            onClick={handleClickRemove("back")}
                                        >
                                            {uploadState.back ===
                                            UPLOAD_STATE.DELETING ? (
                                                <LoaderCircle
                                                    size={15}
                                                    className="animate-spin"
                                                />
                                            ) : (
                                                <Trash size={15} />
                                            )}
                                            Remove
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <button
                            disabled={
                                state ===
                                CREATE_INVITATION_CARD_STATE.CANCELLING
                            }
                            onClick={handleCancelCreate}
                            className="flex-1 box-border h-fit p-2 flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-500 rounded-md bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600 duration-100"
                        >
                            Cancel
                        </button>
                        <button
                            disabled={
                                state ===
                                CREATE_INVITATION_CARD_STATE.CREATING_FORM
                            }
                            className="flex-1 box-border h-fit p-2 flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-500 rounded-md bg-slate-800 dark:bg-white text-white dark:text-slate-800 hover:bg-slate-700 dark:hover:bg-slate-100 duration-100"
                            onClick={handleCreateConfirm}
                        >
                            Confirm
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
