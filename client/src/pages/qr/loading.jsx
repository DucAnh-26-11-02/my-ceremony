export default function Loading() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8 max-w-md w-full text-center">
                <div className="animate-spin w-12 h-12 border-4 border-slate-300 dark:border-slate-600 border-t-slate-900 dark:border-t-slate-200 rounded-full mx-auto mb-6"></div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
                    Loading Ceremony
                </h2>
                <p className="text-slate-600 dark:text-slate-300">
                    Please wait while we fetch the ceremony details...
                </p>
            </div>
        </div>
    );
}
