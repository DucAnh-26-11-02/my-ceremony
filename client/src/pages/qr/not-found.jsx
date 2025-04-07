export default function NotFound() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8 max-w-md w-full text-center">
                <h1 className="text-3xl font-bold text-red-500 dark:text-red-400 mb-4">
                    Ceremony Not Found
                </h1>
                <p className="text-slate-600 dark:text-slate-300 mb-6">
                    The ceremony you're looking for doesn't exist or the
                    provided alias and code combination is invalid.
                </p>
                <a
                    href="/"
                    className="inline-flex items-center justify-center rounded-md bg-slate-900 dark:bg-slate-200 px-4 py-2 text-sm font-medium text-white dark:text-slate-900 shadow transition-colors hover:bg-slate-700 dark:hover:bg-slate-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                    Return Home
                </a>
            </div>
        </div>
    );
}
