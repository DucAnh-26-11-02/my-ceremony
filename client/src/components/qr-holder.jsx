import { useRef, useState } from "react";
import {
    Check,
    CircleAlert,
    LoaderIcon,
    RefreshCw,
    Upload,
    X,
} from "lucide-react";
import jsQR from "jsqr";
import { Configs } from "../constants";

const QR_HOLDER_STATES = {
    IDLE: "IDLE",
    IS_DRAGGING: "IS_DRAGGING",
    DRAG_END: "DRAG_END",
    IS_LOADING_IMAGE: "IS_LOADING_IMAGE",
    LOADED_IMAGE: "LOADED_IMAGE",
    LOAD_FAILED_IMAGE: "LOAD_FAILED_IMAGE",
    SCANNING_QR: "SCANNING_QR",
    SCANNED_QR: "SCANNED_QR",
    CORRECT_FORMAT_QR: "CORRECT_FORMAT_QR",
    INVALID_FORMAT: "INVALID_FORMAT",
    SCAN_FAILED_QR: "SCAN_FAILED_QR",
};

export function QrHolder() {
    const [qrImage, setQrImage] = useState(null);
    const [qrResult, setQrResult] = useState("");
    const [state, setState] = useState(QR_HOLDER_STATES.IDLE);
    const fileInputRef = useRef(null);

    const isCorrectFormatQrResult = (result = "") => {
        if (!result) return false;

        return result.startsWith(Configs.frontend_url + "/qr");
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setState(QR_HOLDER_STATES.IS_DRAGGING);
    };

    const handleDragLeave = () => {
        setState(QR_HOLDER_STATES.IDLE);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setState(QR_HOLDER_STATES.IDLE);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleFileInput = (e) => {
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const handleFile = (file) => {
        setState(QR_HOLDER_STATES.IS_LOADING_IMAGE);
        if (!file.type.match("image.*")) {
            alert("Please select an image file");
            setState(QR_HOLDER_STATES.LOAD_FAILED_IMAGE);
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const imageSrc = e.target?.result;

            setQrImage(imageSrc);
            setState(QR_HOLDER_STATES.LOADED_IMAGE);
            scanQrFromImage(imageSrc);
        };
        reader.readAsDataURL(file);
    };

    const scanQrFromImage = (imageSrc) => {
        const img = new Image();
        img.src = imageSrc;

        img.onload = () => {
            setState(QR_HOLDER_STATES.SCANNING_QR);

            const canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;

            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            const imageData = ctx.getImageData(
                0,
                0,
                canvas.width,
                canvas.height
            );
            const code = jsQR(
                imageData.data,
                imageData.width,
                imageData.height
            );

            if (code) {
                setState(QR_HOLDER_STATES.SCANNED_QR);
                if (!isCorrectFormatQrResult(code.data)) {
                    setQrResult(null);
                    setState(QR_HOLDER_STATES.INVALID_FORMAT);
                } else {
                    setQrResult(code.data);
                    setState(QR_HOLDER_STATES.CORRECT_FORMAT_QR);
                }
            } else {
                setQrResult(null);
                setState(QR_HOLDER_STATES.SCAN_FAILED_QR);
            }
        };

        img.onerror = () => {
            setQrResult("Failed to load image");
            setState(QR_HOLDER_STATES.LOAD_FAILED_IMAGE);
        };
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    const resetQrImage = () => {
        setQrImage(null);
        fileInputRef.current.value = null;
        setState(QR_HOLDER_STATES.IDLE);
    };

    return (
        <div className="flex justify-center flex-col gap-5 w-fit h-fit">
            <div
                className={`relative w-full aspect-square h-64 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all duration-200 mx-auto ${
                    state === QR_HOLDER_STATES.IS_DRAGGING
                        ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20"
                        : qrImage
                        ? "border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700"
                        : "border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={qrImage ? undefined : triggerFileInput}
            >
                <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    size="2mb"
                    ref={fileInputRef}
                    onChange={handleFileInput}
                />

                {state === QR_HOLDER_STATES.IS_LOADING_IMAGE && (
                    <div className="flex flex-col items-center justify-center">
                        <RefreshCw className="h-10 w-10 sm:h-12 sm:w-12 text-slate-400 dark:text-slate-300 animate-spin" />
                        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                            Processing...
                        </p>
                    </div>
                )}

                {qrImage && (
                    <div className="relative w-full h-full box-border p-2">
                        <div className="relative w-full h-full rounded-md overflow-hidden">
                            <img
                                src={qrImage || "/placeholder.svg"}
                                alt="QR Code"
                                className="w-full h-full object-cover"
                            />
                            <button
                                className="absolute top-2 right-2 bg-slate-800 dark:bg-slate-200 bg-opacity-70 dark:bg-opacity-70 text-white dark:text-slate-800 rounded-full p-2 hover:bg-opacity-100 dark:hover:bg-opacity-100 transition-all"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    resetQrImage();
                                }}
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                )}

                {state === QR_HOLDER_STATES.IDLE && (
                    <div className="flex flex-col items-center justify-center p-4 text-center">
                        <Upload className="h-10 w-10 sm:h-12 sm:w-12 text-slate-400 dark:text-slate-300 mb-2" />
                        <p className="text-slate-600 dark:text-slate-300 font-medium">
                            Drop QR code here
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                            or tap to upload
                        </p>
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-4">
                            Supports: JPG, PNG, GIF
                        </p>
                    </div>
                )}
            </div>
            <div className="box-border h-fit w-auto">
                {state === QR_HOLDER_STATES.SCANNING_QR && (
                    <div className=" bg-emerald-500 dark:bg-emerald-600 text-white text-center py-2 text-sm rounded-md">
                        <LoaderIcon className="inline-block h-4 w-4 mr-1 animate-spin" />
                        Scanning QR code
                    </div>
                )}
                {state === QR_HOLDER_STATES.CORRECT_FORMAT_QR && !!qrResult && (
                    <div className=" bg-emerald-500 dark:bg-emerald-600 text-white text-center py-2 text-sm rounded-md flex flex-col items-center">
                        <div className="flex">
                            <Check className="inline-block h-4 w-4 mr-1" />
                            <p>QR Code Ready</p>
                        </div>
                        <a
                            href={qrResult}
                            className="underline font-bold w-fit"
                        >
                            Click to navigate{" "}
                        </a>
                    </div>
                )}
                {state === QR_HOLDER_STATES.SCAN_FAILED_QR && (
                    <div className=" bg-red-500 dark:bg-red-600 text-white text-center py-2 text-sm rounded-md">
                        <X className="inline-block h-4 w-4 mr-1" />
                        Failed to get QR data
                    </div>
                )}
                {state === QR_HOLDER_STATES.INVALID_FORMAT && (
                    <div className=" bg-yellow-500 dark:bg-yellow-600 text-white text-center py-2 text-sm rounded-md">
                        <CircleAlert className="inline-block h-4 w-4 mr-1" />
                        Invalid QR data format
                    </div>
                )}
            </div>
        </div>
    );
}
