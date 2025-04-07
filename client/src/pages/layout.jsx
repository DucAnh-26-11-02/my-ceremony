import { Outlet } from "react-router";
import ThemeToggle from "../components/theme-toggle";

export default function MainLayout() {
    return (
        <>
            <ThemeToggle />
            <Outlet />
        </>
    );
}
