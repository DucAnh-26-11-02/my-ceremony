import { Outlet, Route, Routes } from "react-router";
import MainPage from "../pages";
import MainLayout from "../pages/layout";
import QrPage from "../pages/qr";
import QrLayout from "../pages/qr/layout";
import { Configs } from "../constants";
import NotOpenPage from "../pages/not-open";
import { ReturnHome } from "../components/return-home";

export default function AppRouter() {
    return (
        <Routes>
            <Route element={<MainLayout />}>
                {Configs.app_open === "open" && (
                    <>
                        <Route path="/" element={<MainPage />} />
                        <Route
                            element={
                                <>
                                    <Outlet />
                                    <ReturnHome />
                                </>
                            }
                        >
                            <Route path="/qr" element={<QrLayout />}>
                                <Route path="" element={<QrPage />} />
                            </Route>
                            <Route path="*" element={<p>Not found</p>} />
                        </Route>
                    </>
                )}
                {Configs.app_open === "closed" && (
                    <>
                        <Route path="*" element={<NotOpenPage />} />
                    </>
                )}
            </Route>
        </Routes>
    );
}
