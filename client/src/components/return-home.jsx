import { Home } from "lucide-react";

export function ReturnHome() {
    return (
        <a
            href="/"
            className="fixed top-4 left-4 z-10 p-2 backdrop-blur-sm bg-white/50 dark:bg-slate-800/50 border border-white/20 dark:border-slate-700/50 rounded-full text-slate-700 dark:text-slate-200 hover:bg-white/70 dark:hover:bg-slate-700/70 transition-colors"
            aria-label="Return to home page"
        >
            <Home className="h-5 w-5" />
        </a>
    );
}
