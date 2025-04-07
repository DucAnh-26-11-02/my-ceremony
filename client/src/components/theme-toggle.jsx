import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        const savedTheme = localStorage.getItem("my_ceremony_theme");
        const prefersDark = window.matchMedia(
            "(prefers-color-scheme: dark)"
        ).matches;

        if (!savedTheme) {
            if (prefersDark) {
                setIsDarkMode(true);
                document.documentElement.classList.add("dark");
                return;
            } else {
                setIsDarkMode(false);
                document.documentElement.classList.remove("dark");
                return;
            }
        }
        if (savedTheme === "dark") {
            setIsDarkMode(true);
            document.documentElement.classList.add("dark");
        } else if (savedTheme === "light") {
            setIsDarkMode(false);
            document.documentElement.classList.remove("dark");
        }
    }, []);

    const toggleTheme = () => {
        if (isDarkMode) {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("my_ceremony_theme", "light");
            setIsDarkMode(false);
        } else {
            document.documentElement.classList.add("dark");
            localStorage.setItem("my_ceremony_theme", "dark");
            setIsDarkMode(true);
        }
    };

    return (
        <button
            onClick={toggleTheme}
            className="fixed top-4 right-4 z-10 p-2 backdrop-blur-sm bg-white/50 dark:bg-slate-800/50 border border-white/20 dark:border-slate-700/50 rounded-full text-slate-700 dark:text-slate-200 hover:bg-white/70 dark:hover:bg-slate-700/70 transition-colors"
            aria-label={
                isDarkMode ? "Switch to light mode" : "Switch to dark mode"
            }
        >
            {isDarkMode ? (
                <Sun className="h-5 w-5" />
            ) : (
                <Moon className="h-5 w-5" />
            )}
        </button>
    );
}
