import { Route, Routes } from "react-router";
import MainPage from "../pages";
import MainLayout from "../pages/layout";
import QrPage from "../pages/qr";
import QrLayout from "../pages/qr/layout";

export default function AppRouter() {
    return (
        <Routes>
            <Route element={<MainLayout />}>
                <Route path="" element={<MainPage />} />
                <Route path="qr" element={<QrLayout />}>
                    <Route path="" element={<QrPage />} />
                </Route>
                <Route path="*" element={<p>Not found</p>} />
            </Route>
        </Routes>
    );
}
