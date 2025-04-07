export default function NotOpenPage() {
    document.title = "App Is Not Open - Ceremony Details";
    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4 transition-colors duration-200">
            <div className="max-w-md w-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl shadow-lg p-8 border border-white/20 dark:border-slate-700/50 text-center">
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white mb-4">
                    App Is Not Open
                </h1>
                <p className="text-slate-600 dark:text-slate-300">
                    We're sorry, but this application is not available at the
                    moment.
                </p>
            </div>
        </div>
    );
}
