import { Fragment, useEffect, useState } from "react";
import CardModal from "./card-modal";
import CreateInvitationCard from "./create-invitation-card";
import { Configs } from "../constants";
import InvitationCard from "./invitaion-card";
import { FileX2 } from "lucide-react";

const canEdit = Configs.app_state === "allow_edit";

const STATES = {
    MAPPING_ID: "MAPPING_ID",
    MAP_DEFAULT_STATE: "MAP_DEFAULT_STATE",
};

export default function CeremonyInvitaionCards({ cards = [], onSave }) {
    const [viewerData, setViewerData] = useState(null);
    const [invitaionCards, setInvitaionCards] = useState([]);
    const [isUpdate, setIsUpdate] = useState(false);

    const handleCloseModal = () => setViewerData(null);

    const mapId = (cards, state) => {
        return cards.map((card, index) => ({
            id: index + 1,
            ...card,
        }));
    };

    const mapDefaultState = (cards) => {
        console.log(cards);
        return cards.map((card) => ({ ...card, status: 0 }));
    };

    const handleClickReview = (card) => (type) => {
        setViewerData({
            card,
            type,
        });
    };

    const handleCreateConfirm = (data) => {
        setInvitaionCards((prev) => [
            ...prev,
            {
                id: prev.length + 1,
                ...data,
                status: 1,
            },
        ]);
        setIsUpdate(true);
    };

    const handleDeleted = (id) => {
        setInvitaionCards((prev) =>
            prev.map((card) => (card.id === id ? { ...card, status: 3 } : card))
        );
        setIsUpdate(true);
    };

    const handleSaveChanges = () => {
        onSave(invitaionCards);
        setIsUpdate(false);
    };

    useEffect(() => {
        setInvitaionCards(mapDefaultState(mapId(cards)));
        setIsUpdate(false);
    }, [cards]);

    return (
        <>
            <div className="flex flex-col md:gap-5 gap-3 w-full relative">
                {isUpdate && canEdit && (
                    <div className="w-full">
                        <button
                            className="text-slate-800 dark:text-slate-50 bg-transparent border border-slate-300 dark:border-slate-500 p-2 md:p-3 w-full rounded-lg"
                            onClick={handleSaveChanges}
                        >
                            Save changes
                        </button>
                    </div>
                )}

                {!invitaionCards.length ? (
                    <div className="text-center p-8">
                        <FileX2 className="h-12 w-12 text-slate-400 dark:text-slate-500 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-slate-700 dark:text-slate-300 mb-2">
                            No Invitation Cards
                        </h3>
                        <p className="text-slate-500 dark:text-slate-400">
                            There are no invitation cards associated with this
                            ceremony yet.
                        </p>
                    </div>
                ) : (
                    invitaionCards.map((card, index) => (
                        <Fragment key={card.id + "_ceremony_invitation_card"}>
                            <InvitationCard
                                card={card}
                                canEdit={canEdit}
                                onClickReview={handleClickReview(card)}
                                onDelete={handleDeleted}
                            />
                        </Fragment>
                    ))
                )}
                {canEdit && (
                    <CreateInvitationCard
                        onCreateConfirm={handleCreateConfirm}
                    />
                )}
            </div>

            {viewerData && (
                <CardModal data={viewerData} onClose={handleCloseModal} />
            )}
        </>
    );
}
