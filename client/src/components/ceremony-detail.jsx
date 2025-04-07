import { useState } from "react";
import { Calendar, Clock, Hash, LoaderCircle, User } from "lucide-react";
import { QrDownload } from "./qr-download";
import CeremonyInvitaionCards from "./ceremony-invitation-cards";
import { Configs } from "../constants";

const STATES = {
    IDLE: "IDLE",
    IS_UPDATING: "IS_UPDATING",
};

export default function CeremonyDetails({ ceremony, onUpdate }) {
    const [activeTab, setActiveTab] = useState("details");
    const [state, setState] = useState(STATES.IDLE);

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

    const handleSaveInvitationCards = (cards) => {
        const newData = {
            alias: ceremony.alias,
            name: ceremony.name,
            invitationCards: cards,
            contents: ceremony.contents,
        };
        setState(STATES.IS_UPDATING);

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

    return (
        <div className="flex flex-col gap-3 w-full">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg dark:shadow-slate-700/20 overflow-hidden">
                <div className="flex border-b border-slate-200 dark:border-slate-700">
                    <button
                        onClick={() => setActiveTab("details")}
                        className={`flex-1 py-3 px-4 text-sm sm:text-base font-medium transition-colors ${
                            activeTab === "details"
                                ? "bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white"
                                : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                        }`}
                    >
                        Details
                    </button>
                    <button
                        onClick={() => setActiveTab("cards")}
                        className={`flex-1 py-3 px-4 text-sm sm:text-base font-medium transition-colors ${
                            activeTab === "cards"
                                ? "bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white"
                                : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                        }`}
                    >
                        Invitation Cards ({ceremony.invitationCards.length})
                    </button>
                </div>

                {/* Content */}
                <div className="p-4 sm:p-6 relative">
                    {state === STATES.IS_UPDATING && (
                        <div className="absolute w-full h-full bg-slate-800/50 backdrop-blur-sm flex flex-col gap-2 items-center justify-center top-0 left-0 z-50">
                            <LoaderCircle size={20} className="animate-spin" />
                            <p>Updating</p>
                        </div>
                    )}
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
        </div>
    );
}
