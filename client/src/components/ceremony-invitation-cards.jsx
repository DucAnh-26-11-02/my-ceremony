import { Fragment, useEffect, useState } from "react";
import CardModal from "./card-modal";
import CreateInvitationCard from "./create-invitation-card";
import { Configs } from "../constants";
import InvitationCard from "./invitaion-card";

const canEdit = Configs.app_state === "allow_edit";

export default function CeremonyInvitaionCards({ cards }) {
    const [viewerData, setViewerData] = useState(null);
    const [invitaionCards, setInvitaionCards] = useState(cards);

    const handleCloseModal = () => setViewerData(null);

    const mapId = (cards) => {
        return cards.map((card, index) => {
            return {
                id: index + 1,
                ...card,
            };
        });
    };

    const handleUpdate = (id, data) => {
        setInvitaionCards((prev) =>
            prev.map((card) => {
                if (card.id === id) {
                    return { ...card, ...data };
                }
                return card;
            })
        );
    };

    useEffect(() => {
        setInvitaionCards(mapId(cards));
    }, [invitaionCards]);

    return (
        <>
            <div className="flex flex-col gap-5 w-full">
                {invitaionCards.map((card, index) => (
                    <Fragment key={card.id}>
                        <InvitationCard
                            card={card}
                            canEdit={canEdit}
                            setViewerData={setViewerData}
                            onUpdate={handleUpdate}
                        />
                    </Fragment>
                ))}
                {canEdit && <CreateInvitationCard />}
            </div>

            {viewerData && (
                <CardModal card={viewerData} onClose={handleCloseModal} />
            )}
        </>
    );
}
