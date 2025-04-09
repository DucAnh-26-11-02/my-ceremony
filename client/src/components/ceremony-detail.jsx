import { useEffect, useState } from "react";
import { Calendar, Clock, Hash, LoaderCircle, User } from "lucide-react";
import { QrDownload } from "./qr-download";
import CeremonyInvitaionCards from "./ceremony-invitation-cards";
import { Configs } from "../constants";
import ModifyContentCard from "./modify-content-card";

const STATES = {
    IDLE: "IDLE",
    IS_UPDATING: "IS_UPDATING",
    OPEN_ADD_CONTENT: "OPEN_ADD_CONTENT",
};

const canEdit = Configs.app_state === "allow_edit";

export default function CeremonyDetails({ ceremony, onUpdate }) {
    const [activeTab, setActiveTab] = useState("details");
    const [state, setState] = useState(STATES.IDLE);
    const [contents, setContents] = useState(ceremony.contents);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat("vi-VI", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }).format(date);
    };

    const infoItems = [
        {
            label: "Name",
            value: ceremony.name,
            icon: User,
        },
        {
            label: "Code",
            value: ceremony.code,
            icon: Hash,
        },
        {
            label: "Created",
            value: formatDate(ceremony.createdAt),
            icon: Calendar,
        },
        {
            label: "Updated",
            value: formatDate(ceremony.updatedAt),
            icon: Clock,
        },
    ];

    const getId = () => {
        return (contents.at(-1)?.id || 0) + 1;
    };

    const handleRemoveImage = async (image) => {
        if (!image) return null;

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
            return null;
        }

        return true;
    };

    const cleanCards = (cards) => {
        return cards.reduce((acc, curr) => {
            if (curr.status === 3) return acc;

            acc.push({
                name: curr.name,
                front: curr.front,
                back: curr.back,
            });

            return acc;
        }, []);
    };

    const cleanContents = (contents) => {
        return contents.map((content) => {
            const { isNew, isDelete, id, ...cleanedContent } = content;

            return cleanedContent;
        });
    };

    const handleSaveInvitationCards = (cards) => {
        const removeCards = cards.filter((i) => i.status === 3);
        const removeImages = [];

        if (removeCards.length) {
            removeCards.forEach((card) => {
                const { front, back } = card;
                removeImages.push(
                    handleRemoveImage(front),
                    handleRemoveImage(back)
                );
            });
        }
        const newData = {
            alias: ceremony.alias,
            name: ceremony.name,
            invitationCards: cleanCards(cards),
            contents: ceremony.contents,
        };
        setState(STATES.IS_UPDATING);
        Promise.all(removeImages).then(() => {
            fetch(`${Configs.backend_url}/u/${ceremony.alias}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    code: Configs.backend_code,
                },
                body: JSON.stringify(newData),
            }).then((res) => {
                onUpdate();
                setState(STATES.IDLE);
            });
        });
    };

    const handleClickAddContent = () => {
        setState(STATES.OPEN_ADD_CONTENT);
    };

    const handleSaveContent = () => {
        const newData = {
            alias: ceremony.alias,
            name: ceremony.name,
            invitationCards: ceremony.invitationCards,
            contents: cleanContents(contents),
        };
        fetch(`${Configs.backend_url}/u/${ceremony.alias}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                code: Configs.backend_code,
            },
            body: JSON.stringify(newData),
        }).then((res) => {
            onUpdate();
            setState(STATES.IDLE);
        });
    };

    const handleConfirmChange = (content) => {
        let newContent = contents;
        if (content.isNew) {
            newContent = [...contents, { ...content, isNew: false }];
        } else if (content.isDelete) {
            newContent = contents.filter((c) => c.id !== content.id);
        } else {
            newContent = contents.map((c) =>
                c.id === content.id ? content : c
            );
        }

        setContents(newContent);
    };

    return (
        <div className="flex flex-col gap-3 w-full">
            {state === STATES.IS_UPDATING && (
                <div className="absolute w-full h-full bg-slate-800/50 backdrop-blur-sm flex flex-col gap-2 items-center justify-center top-0 left-0 z-50">
                    <LoaderCircle size={20} className="animate-spin" />
                    <p>Updating</p>
                </div>
            )}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg dark:shadow-slate-700/20 overflow-hidden">
                <div className="flex border-b border-slate-200 dark:border-slate-700">
                    <button
                        onClick={() => setActiveTab("details")}
                        className={`flex-1 py-3 px-2 md:px-4 text-sm sm:text-base font-medium transition-colors ${
                            activeTab === "details"
                                ? "bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white"
                                : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                        }`}
                    >
                        Details
                    </button>
                    <button
                        onClick={() => setActiveTab("cards")}
                        className={`flex-1 py-3 px-2 md:px-4 text-sm sm:text-base font-medium transition-colors ${
                            activeTab === "cards"
                                ? "bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white"
                                : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                        }`}
                    >
                        Invitation Cards ({ceremony.invitationCards.length})
                    </button>
                </div>

                {/* Content */}
                <div className="p-2 md:p-6 relative">
                    {activeTab === "details" && (
                        <div className="space-y-4">
                            {infoItems.map(
                                ({ label, value, icon: Icon }, index) => (
                                    <div
                                        key={index}
                                        className="flex flex-col sm:flex-row sm:items-center p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg"
                                    >
                                        <div className="flex items-center mb-2 sm:mb-0 sm:mr-4">
                                            <Icon className="h-5 w-5 text-slate-500 dark:text-slate-400 mr-2" />
                                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                                {label}:
                                            </span>
                                        </div>
                                        <span className="text-slate-900 dark:text-white font-semibold break-all capitalize">
                                            {value}
                                        </span>
                                    </div>
                                )
                            )}

                            <div className="flex w-full justify-center items-center">
                                <QrDownload
                                    qrCodeUrl={ceremony.invitationQr}
                                    altText={`ceremony_qr_code_${ceremony.alias}_${ceremony.code}`}
                                />
                            </div>
                        </div>
                    )}

                    {activeTab === "cards" && (
                        <div className="min-h-[150px] flex flex-col items-center justify-center">
                            <CeremonyInvitaionCards
                                cards={ceremony.invitationCards}
                                onSave={handleSaveInvitationCards}
                            />
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="bg-slate-50 dark:bg-slate-700/30 px-4 py-3 text-center text-xs text-slate-500 dark:text-slate-400">
                    Duc Anh Ceremony
                </div>
            </div>

            {/* Content */}
            <div
                className={` flex flex-col gap-3 py-2 box-border ${
                    state === STATES.OPEN_ADD_CONTENT ||
                    ceremony.contents.length
                        ? "min-h-[90dvh]"
                        : ""
                }`}
            >
                {contents.map((content) => (
                    <ModifyContentCard
                        mode="update"
                        initContent={content}
                        onConfirm={handleConfirmChange}
                        isEditing={canEdit}
                    />
                ))}
                {canEdit && (
                    <div className="flex flex-col gap-2 w-full sticky bottom-0 left-0 bg-slate-50 dark:bg-slate-800 p-5 rounded-md">
                        <button
                            onClick={handleSaveContent}
                            className="w-full border border-slate-300 dark:border-slate-600 py-2 rounded-md hover:bg-slate-300 dark:hover:bg-slate-700 text-sm"
                        >
                            Save changes
                        </button>
                        <button
                            onClick={handleClickAddContent}
                            className="w-full border border-slate-300 dark:border-slate-600 py-2 rounded-md hover:bg-slate-300 dark:hover:bg-slate-700 text-sm"
                        >
                            Add Content
                        </button>
                        {state === STATES.OPEN_ADD_CONTENT && (
                            <ModifyContentCard
                                getId={getId}
                                onConfirm={handleConfirmChange}
                                isEditing={canEdit}
                            />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
