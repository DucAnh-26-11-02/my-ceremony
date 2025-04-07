import { useState } from "react";

const CREATE_INVITATION_CARD_STATE = {
    OPEN_FORM: "OPEN",
    CLOSE_FORM: "CLOSE",
    CREATE_FORM: "CREATE",
};
export default function CreateInvitationCard({ setViewerData }) {
    const [formData, setFormData] = useState({
        name: "",
        front: "",
        back: "",
    });
    const [state, setState] = useState(CREATE_INVITATION_CARD_STATE.CLOSE_FORM);

    const createNewData = () => {
        setViewerData(formData);
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
                createNewData();
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

    const handleChangeImage = (type) => (e) => {
        switch (type) {
            case "front":
                //call api to push image to server.
                // after get name url path response
                // combine backend_url + path to get full url
                break;
            case "back":
                //call api to push image to server.
                // after get name url path response
                // combine backend_url + path to get full url
                break;

            default:
                break;
        }
    };

    return (
        <div>
            <div>
                <button
                    onClick={handleChangeState(
                        CREATE_INVITATION_CARD_STATE.OPEN_FORM
                    )}
                >
                    Create
                </button>
            </div>
            {state === CREATE_INVITATION_CARD_STATE.OPEN_FORM && (
                <div className="h-fit flex flex-col gap-3 w-full box-border p-5 border border-slate-200 dark:border-slate-500 rounded-lg bg-white dark:bg-slate-700">
                    <div className="w-full overflow-hidden">
                        <input
                            placeholder="Card Name"
                            value={formData.name}
                            onChange={handleChangeName}
                        />
                    </div>

                    <div className="rounded-md box-border w-full h-fit gap-5 grid grid-cols-2 duration-75">
                        <div
                            className="rounded-lg bg-slate-50 dark:bg-slate-900 overflow-hidden w-full hover:shadow-xl hover:border-slate-700 dark:hover:border-white box-border border-slate-200 border hover:cursor-pointer duration-100 shadow-none group"
                            onClick={() => setViewerData(formData)}
                        >
                            {!!formData.front ? (
                                <img
                                    src={formData.front}
                                    alt="Ceremony Invitation Front"
                                    className="w-full h-auto object-contain group-hover:scale-105 duration-100 blur-md group-hover:blur-none"
                                />
                            ) : (
                                <></>
                            )}
                        </div>
                        <div
                            className="rounded-lg bg-slate-50 dark:bg-slate-900 overflow-hidden w-full hover:shadow-xl hover:border-slate-700 dark:hover:border-white box-border border-slate-200 border hover:cursor-pointer duration-100 shadow-none group"
                            onClick={() => setViewerData(formData)}
                        >
                            {!!formData.back ? (
                                <img
                                    src={formData.back}
                                    alt="Ceremony Invitation Back"
                                    className="w-full h-auto object-contain group-hover:scale-105 duration-100 blur-md group-hover:blur-none"
                                />
                            ) : (
                                <></>
                            )}
                        </div>
                    </div>

                    <div>
                        <button
                            onClick={handleChangeImage(
                                CREATE_INVITATION_CARD_STATE.CLOSE_FORM
                            )}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleChangeImage(
                                CREATE_INVITATION_CARD_STATE.CREATE_FORM
                            )}
                        >
                            Confirm
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
