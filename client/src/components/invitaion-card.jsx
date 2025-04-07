import { PencilLine, TrashIcon } from "lucide-react";

export default function InvitationCard({
    card,
    canEdit,
    setViewerData,
    onUpdate,
}) {
    return (
        <div className="relative h-fit flex flex-col gap-3 w-full box-border p-5 border border-slate-200 dark:border-slate-500 rounded-lg bg-white dark:bg-slate-700">
            <div className="w-full overflow-hidden flex">
                <p className="w-full line-clamp-1 whitespace-nowrap text-ellipsis font-bold text-lg">
                    {card.name}
                </p>
                {canEdit && (
                    <div>
                        <button>
                            <PencilLine className="mr-2" /> Edit
                        </button>
                        <button>
                            <TrashIcon className="mr-2" /> Delete
                        </button>
                    </div>
                )}
            </div>

            <div className="rounded-md box-border w-full h-fit gap-5 grid grid-cols-2 duration-75">
                {card.front && (
                    <div
                        className="rounded-lg bg-slate-50 dark:bg-slate-900 overflow-hidden w-full hover:shadow-xl hover:border-slate-700 dark:hover:border-white box-border border-slate-200 border hover:cursor-pointer duration-100 shadow-none group"
                        onClick={() => setViewerData(card)}
                    >
                        <img
                            src={card.front}
                            alt="Ceremony Invitation Front"
                            className="w-full h-auto object-contain group-hover:scale-105 duration-100 blur-md group-hover:blur-none"
                        />
                    </div>
                )}
                {card.back && (
                    <div
                        className="rounded-lg bg-slate-50 dark:bg-slate-900 overflow-hidden w-full hover:shadow-xl hover:border-slate-700 dark:hover:border-white box-border border-slate-200 border hover:cursor-pointer duration-100 shadow-none group"
                        onClick={() => setViewerData(card)}
                    >
                        <img
                            src={card.back}
                            alt="Ceremony Invitation Back"
                            className="w-full h-auto object-contain group-hover:scale-105 duration-100 blur-md group-hover:blur-none"
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
