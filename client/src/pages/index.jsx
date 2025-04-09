import { QrDownloadModal } from "../components/qr-download-modal";
import { QrHolder } from "../components/qr-holder";
import { Configs } from "../constants";

export default function MainPage() {
    document.title = "Chào cậu, tớ là Đức Anh";

    return (
        <>
            <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 py-6 sm:py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
                <div className="max-w-3xl mx-auto">
                    <div className="text-center mb-6 sm:mb-12">
                        <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 dark:text-white mb-3 sm:mb-4">
                            Welcome to the Ceremony
                        </h1>
                        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300">
                            Please scan the QR code below to register your
                            attendance
                        </p>
                    </div>

                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg dark:shadow-slate-700/20 p-4 sm:p-8 mb-8 sm:mb-12 flex flex-col items-center">
                        <div className="text-center mb-4 sm:mb-6">
                            <h2 className="text-xl sm:text-2xl font-semibold text-slate-700 dark:text-slate-200">
                                Scan QR Code
                            </h2>
                            <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-1 sm:mt-2">
                                Use your smartphone camera to scan the QR code
                            </p>
                        </div>

                        <QrHolder />
                    </div>

                    <div className="text-center text-slate-500 dark:text-slate-400 text-xs sm:text-sm">
                        <p>
                            © {new Date().getFullYear()} Ceremony Organizers.
                            All rights reserved.
                        </p>
                    </div>
                </div>
            </div>

            {Configs.app_state === "allow_edit" && <QrDownloadModal />}
        </>
    );
}
