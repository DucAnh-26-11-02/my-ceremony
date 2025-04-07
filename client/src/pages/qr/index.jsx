import React, { useEffect, useState } from "react";
import NotFound from "./not-found";
import Loading from "./loading";
import CeremonyDetails from "../../components/ceremony-detail";
import { Configs } from "../../constants";
import { ReturnHome } from "../../components/return-home";

const getCeremonyData = async (alias, code) => {
    const res = await fetch(
        `${Configs.backend_url}/u/qr/data?alias=${alias}&code=${code}`
    );
    if (res.ok) {
        const data = await res.json();
        return data.data;
    } else {
        console.error("Error fetching ceremony data:", res.statusText);
        return null;
    }
};

const QR_PAGE_STATE = {
    IDLE: "IDLE",
    GETTING_CEREMONY_DATA: "GETTING_CEREMONY_DATA",
    LOADED_CEREMONY_DATA: "LOADED_CEREMONY_DATA",
    MISSING_QUERY_PARAMS: "MISSING_QUERY_PARAMS",
    NOT_FOUND_CEREMONY_DATA: "NOT_FOUND_CEREMONY_DATA",
};

export default function QrPage() {
    const [ceremonyData, setCeremonyData] = useState(null);
    const [state, setState] = useState(QR_PAGE_STATE.GETTING_CEREMONY_DATA);
    const searchParams = new URLSearchParams(window.location.search);
    const alias = searchParams.get("alias") ?? "";
    const code = searchParams.get("code") ?? "";

    const onUpdate = async () => {
        const data = await getCeremonyData(alias, code);
        if (data) {
            setCeremonyData(data);
            setState(QR_PAGE_STATE.LOADED_CEREMONY_DATA);
        } else {
            setState(QR_PAGE_STATE.NOT_FOUND_CEREMONY_DATA);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            if (!alias || !code) {
                setState(QR_PAGE_STATE.MISSING_QUERY_PARAMS);
                return;
            }

            const data = await getCeremonyData(alias, code);
            if (data) {
                setCeremonyData(data);
                setState(QR_PAGE_STATE.LOADED_CEREMONY_DATA);
            } else {
                setState(QR_PAGE_STATE.NOT_FOUND_CEREMONY_DATA);
            }
        };

        fetchData();
    }, [alias, code]);

    if (state === QR_PAGE_STATE.MISSING_QUERY_PARAMS) {
        document.title = "Missing Parameters - Ceremony Details";
        return (
            <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 max-w-md w-full text-center">
                    <h1 className="text-2xl font-bold text-red-500 dark:text-red-400 mb-4">
                        Missing Parameters
                    </h1>
                    <p className="text-slate-600 dark:text-slate-300 mb-4">
                        The 'alias' or 'code' parameters are required to view
                        ceremony details.
                    </p>
                </div>
            </div>
        );
    }

    if (state === QR_PAGE_STATE.NOT_FOUND_CEREMONY_DATA) {
        document.title = "Not Found - Ceremony Details";
        return <NotFound />;
    }

    if (state === QR_PAGE_STATE.GETTING_CEREMONY_DATA) {
        document.title = "Loading... Ceremony Details";
        return <Loading />;
    }

    if (state === QR_PAGE_STATE.LOADED_CEREMONY_DATA && !!ceremonyData) {
        document.title = "Ceremony Details - " + ceremonyData.name;
        return (
            <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 py-6 sm:py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
                <div className="max-w-3xl mx-auto">
                    <div className="text-center mb-6 sm:mb-12">
                        <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 dark:text-white mb-3 sm:mb-4">
                            Ceremony Details
                        </h1>
                        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300">
                            Viewing information for my ceremony
                        </p>
                    </div>
                    <CeremonyDetails
                        ceremony={ceremonyData}
                        onUpdate={onUpdate}
                    />
                </div>
            </div>
        );
    }
    return null;
}
