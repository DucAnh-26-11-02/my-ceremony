import { useState, useRef, useEffect } from "react";
import { X, Download, User, ImageIcon, User2 } from "lucide-react";
import { Configs } from "../constants";

export function QrDownloadModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [users, setUsers] = useState([]);
    const [newUser, setNewUser] = useState({
        name: "",
        alias: "",
    });
    const modalRef = useRef(null);

    // Handle click outside to close
    const handleClickOutside = (e) => {
        if (modalRef.current && !modalRef.current.contains(e.target)) {
            onClose();
        }
    };

    const onClose = () => {
        setIsOpen(false);
    };

    // Format date for display
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        }).format(date);
    };

    // Handle QR code download
    const handleDownloadQR = (user) => {
        // Create a temporary link element
        const link = document.createElement("a");
        link.href = user.invitationQr;
        link.download = `qr_ceremony_${user.alias}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const fetchUser = () => {
        fetch(`${Configs.backend_url}/u`, {
            headers: {
                code: Configs.backend_code,
            },
        })
            .then((res) => res.json())
            .then((res) => {
                setUsers(res.data.items);
            });
    };

    const handleCreateNew = () => {
        fetch(`${Configs.backend_url}/u`, {
            method: "POST",
            headers: {
                code: Configs.backend_code,
                "Content-type": "application/json",
            },
            body: JSON.stringify(newUser),
        }).then((res) => {
            if (res.ok) {
                fetchUser();
            }
            setNewUser({
                alias: "",
                name: "",
            });
        });
    };

    useEffect(() => {
        fetchUser();
    }, []);

    return (
        <>
            <button
                onClick={() => {
                    setIsOpen(true);
                }}
                className="fixed top-4 left-4 z-10 p-2 backdrop-blur-sm bg-white/50 dark:bg-slate-800/50 border border-white/20 dark:border-slate-700/50 rounded-full text-slate-700 dark:text-slate-200 hover:bg-white/70 dark:hover:bg-slate-700/70 transition-colors"
            >
                <User2 size={15} />
            </button>
            <div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
                style={{
                    display: isOpen ? "flex" : "none",
                }}
                onClick={handleClickOutside}
            >
                <div
                    ref={modalRef}
                    className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 dark:border-slate-700/50 w-full max-w-4xl max-h-[80vh] overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-white/20 dark:border-slate-700/50">
                        <h2 className="text-xl font-semibold text-slate-800 dark:text-white">
                            User List
                        </h2>
                        <button
                            onClick={onClose}
                            className="p-1.5 rounded-full bg-white/50 dark:bg-slate-700/50 text-slate-700 dark:text-slate-300 hover:bg-white/70 dark:hover:bg-slate-600/70 transition-colors"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="overflow-y-auto max-h-[calc(80vh-8rem)]">
                        {users.length > 0 ? (
                            <div className="p-4 space-y-4">
                                {users.map((user) => (
                                    <div
                                        key={user._id}
                                        className="bg-white/50 dark:bg-slate-700/50 backdrop-blur-sm rounded-lg border border-white/10 dark:border-slate-700/30 p-4"
                                    >
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                                            <div className="flex-1">
                                                <h3 className="text-lg font-semibold text-slate-800 dark:text-white flex items-center">
                                                    <User className="h-5 w-5 mr-2 text-slate-500 dark:text-slate-400" />
                                                    {user.name}
                                                </h3>
                                                <div className="mt-2 space-y-1">
                                                    <p className="text-sm text-slate-600 dark:text-slate-300 flex items-center">
                                                        <span className="inline-block w-20 text-slate-500 dark:text-slate-400">
                                                            Alias:
                                                        </span>
                                                        <span className="font-medium">
                                                            {user.alias}
                                                        </span>
                                                    </p>
                                                    <p className="text-sm text-slate-600 dark:text-slate-300 flex items-center">
                                                        <span className="inline-block w-20 text-slate-500 dark:text-slate-400">
                                                            Code:
                                                        </span>
                                                        <span className="font-medium">
                                                            {user.code}
                                                        </span>
                                                    </p>
                                                    <p className="text-sm text-slate-600 dark:text-slate-300 flex items-center">
                                                        <span className="inline-block w-20 text-slate-500 dark:text-slate-400">
                                                            Created:
                                                        </span>
                                                        <span className="font-medium">
                                                            {formatDate(
                                                                user.createdAt
                                                            )}
                                                        </span>
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex flex-col items-center">
                                                <div className="flex items-center mb-2">
                                                    <ImageIcon className="h-5 w-5 mr-2 text-slate-500 dark:text-slate-400" />
                                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                                        Cards:{" "}
                                                        {
                                                            user.invitationCards
                                                                .length
                                                        }
                                                    </span>
                                                </div>
                                                <button
                                                    onClick={() =>
                                                        handleDownloadQR(user)
                                                    }
                                                    className="flex items-center gap-2 px-4 py-2 backdrop-blur-sm bg-white/50 dark:bg-slate-700/50 border border-white/20 dark:border-slate-600/50 rounded-full text-slate-700 dark:text-slate-200 hover:bg-white/70 dark:hover:bg-slate-600/70 transition-colors"
                                                >
                                                    <Download className="h-4 w-4" />
                                                    <span>Download QR</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-8 text-center">
                                <p className="text-slate-600 dark:text-slate-300">
                                    No users found.
                                </p>
                            </div>
                        )}

                        <div className="w-full flex gap-2 px-5">
                            <input
                                placeholder="name"
                                value={newUser.name}
                                onChange={(e) => {
                                    setNewUser((u) => ({
                                        ...u,
                                        name: e.target.value,
                                    }));
                                }}
                                className="flex-1 bg-transparent border rounded-sm p-2 px-3 box-border border-slate-200 dark:border-slate-500 focus:outline-none focus:ring-none focus:ring-transparent focus:border-slate-500 dark:focus:border-sate-200 text-sm duration-100"
                            />
                            <input
                                placeholder="alias"
                                value={newUser.alias}
                                onChange={(e) => {
                                    setNewUser((u) => ({
                                        ...u,
                                        alias: e.target.value,
                                    }));
                                }}
                                className="flex-1 bg-transparent border rounded-sm p-2 px-3 box-border border-slate-200 dark:border-slate-500 focus:outline-none focus:ring-none focus:ring-transparent focus:border-slate-500 dark:focus:border-sate-200 text-sm duration-100"
                            />
                            <button
                                className="flex-2 h-auto px-5 border rounded-md border-slate-300 dark:border-slate-600"
                                onClick={handleCreateNew}
                            >
                                Add
                            </button>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="p-4 border-t border-white/20 dark:border-slate-700/50 text-center text-xs text-slate-500 dark:text-slate-400">
                        <p>Total Users: {users.length}</p>
                    </div>
                </div>
            </div>
        </>
    );
}
