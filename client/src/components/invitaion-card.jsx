import { TrashIcon } from "lucide-react";

export default function InvitationCard({
    card,
    canEdit,
    setViewerData,
    onDelete,
}) {
    const handleDelete = () => {
        onDelete(card.id);
    };
    return (
        <div
            className={`relative h-fit flex flex-col gap-3 w-full box-border p-5 border rounded-lg bg-white dark:bg-slate-700 
            ${
                card.status === 2
                    ? "border-yellow-300 dark:border-yellow-600"
                    : ""
            } 
            ${
                card.status === 1
                    ? "border-green-300 dark:border-green-600"
                    : ""
            } 
            ${
                card.status === 0
                    ? "border-slate-200 dark:border-slate-500"
                    : ""
            }`}
        >
            <div className="w-full overflow-hidden flex">
                <p className="w-full line-clamp-1 whitespace-nowrap text-ellipsis font-bold text-lg">
                    {card.name}
                </p>
                {canEdit && (
                    <div>
                        <button
                            className="flex items-center gap-2 p-2 bg-red-600 text-white hover:bg-red-700 duration-75 rounded-md px-5 text-sm"
                            onClick={handleDelete}
                        >
                            <TrashIcon size={15} /> Delete
                        </button>
                    </div>
                )}
            </div>

            <div
                className={`rounded-md box-border w-full h-fit gap-5 grid grid-cols-2 duration-75 border border-1bg-white dark:bg-slate-700`}
            >
                {card.front && (
                    <div
                        className="rounded-lg bg-slate-50 dark:bg-slate-900 overflow-hidden w-full hover:shadow-xl hover:border-slate-700 dark:hover:border-white box-border border-slate-200 border hover:cursor-pointer duration-100 shadow-none group"
                        onClick={() => setViewerData(card)}
                    >
                        <img
                            src={card.front.url}
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
                            src={card.back.url}
                            alt="Ceremony Invitation Back"
                            className="w-full h-auto object-contain group-hover:scale-105 duration-100 blur-md group-hover:blur-none"
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
