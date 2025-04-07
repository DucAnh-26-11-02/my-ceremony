import { useRef, useState } from "react";
import { Download, X } from "lucide-react";

export function QrDownload({ qrCodeUrl, altText }) {
    const qrRef = useRef(null);
    const [showModal, setShowModal] = useState(false);

    const handleDownload = () => {
        const link = document.createElement("a");
        link.href = qrCodeUrl;
        link.download = `invitation-qr-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <>
            <div className="flex flex-col items-center">
                <div
                    className="relative border border-slate-200 dark:border-slate-700 rounded-lg p-2 bg-white dark:bg-slate-900 transition-all duration-300 w-full max-w-xs sm:max-w-sm cursor-pointer"
                    onClick={() => setShowModal(true)}
                >
                    <img
                        ref={qrRef}
                        src={qrCodeUrl || "/placeholder.svg"}
                        alt={altText}
                        className="w-full h-full object-contain rounded-md"
                    />
                </div>

                <div className="mt-4 flex gap-2">
                    <button
                        onClick={handleDownload}
                        className="group relative overflow-hidden rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 dark:from-emerald-600 dark:to-teal-500 px-6 py-2.5 font-medium text-white shadow-md transition-all duration-300 hover:shadow-lg hover:translate-y-[-2px] active:translate-y-[0px] focus:outline-none focus:ring-2 focus:ring-emerald-400 dark:focus:ring-emerald-600"
                    >
                        <span className="absolute inset-0 bg-white dark:bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
                        <span className="flex items-center gap-2">
                            <Download className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                            <span className="font-medium">
                                Download QR Code
                            </span>
                        </span>
                        <span className="absolute bottom-0 left-0 h-1 w-0 bg-white dark:bg-emerald-300 opacity-30 transition-all duration-300 group-hover:w-full"></span>
                    </button>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div
                    className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 flex-col"
                    onClick={() => setShowModal(false)}
                >
                    <div
                        className="relative md:h-2/3 max-md:max-w-full max-md:w-full aspect-square overflow-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            src={qrCodeUrl}
                            alt={altText}
                            className="w-full h-auto rounded-lg border border-white dark:border-slate-700 shadow-lg"
                        />
                    </div>

                    <div className="mt-4 flex gap-2">
                        <button
                            onClick={handleDownload}
                            className="group relative overflow-hidden rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 dark:from-emerald-600 dark:to-teal-500 px-6 py-2.5 font-medium text-white shadow-md transition-all duration-300 hover:shadow-lg hover:translate-y-[-2px] active:translate-y-[0px] focus:outline-none focus:ring-2 focus:ring-emerald-400 dark:focus:ring-emerald-600"
                        >
                            <span className="absolute inset-0 bg-white dark:bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
                            <span className="flex items-center gap-2">
                                <Download className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                                <span className="font-medium">
                                    Download QR Code
                                </span>
                            </span>
                            <span className="absolute bottom-0 left-0 h-1 w-0 bg-white dark:bg-emerald-300 opacity-30 transition-all duration-300 group-hover:w-full"></span>
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
