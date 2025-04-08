import { useState, useEffect, useRef } from "react";
import {
    FlipHorizontal2,
    RotateCcw,
    RotateCw,
    ZoomIn,
    ZoomOut,
} from "lucide-react"; // Import Lucide icons

function CardModal({ data, onClose }) {
    const [isFlipped, setIsFlipped] = useState(data?.type === "back");
    const [zoom, setZoom] = useState(100);
    const [rotate, setRotate] = useState(0);
    const modalRef = useRef(null);

    useEffect(() => {
        const handleOutsideClick = (e) => {
            if (modalRef.current && !modalRef.current.contains(e.target)) {
                onClose();
            }
        };

        document.addEventListener("mousedown", handleOutsideClick);

        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, [onClose]);

    const toggleFlip = () => setIsFlipped((prev) => !prev);

    const handleZoom = (zoomScale) => () => {
        setZoom((z) => {
            const newZoomValue = z + zoomScale;
            if (newZoomValue > 150) return 150;
            if (newZoomValue < 50) return 50;

            return newZoomValue;
        });
    };

    const handleRotate = (angle) => () => {
        setRotate((r) => r + angle);
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div
                ref={modalRef}
                className="relative w-full max-w-3xl p-5 bg-transparent rounded-lg flex flex-col justify-center items-center"
            >
                <div
                    className={`relative w-full h-80 md:h-96 lg:h-[500px] duration-150`}
                    style={{
                        transform: `scale(${zoom}%) rotate(${rotate}deg)`,
                    }}
                >
                    <div
                        className={`w-full h-full absolute transition-transform duration-700 ease-in-out ${
                            isFlipped ? "rotate-y-180" : ""
                        }`}
                    >
                        {/* Front of the card */}
                        <div
                            className="absolute w-full h-full justify-center items-center duration-700"
                            style={{
                                backgroundImage: `url(${data.card.front.url})`,
                                backgroundSize: "contain",
                                backgroundRepeat: "no-repeat",
                                backgroundPosition: "center",
                                objectFit: "contain",
                                zIndex: isFlipped ? 0 : 1,
                            }}
                        ></div>

                        {/* Back of the card */}
                        <div
                            className="absolute w-full h-full rotate-y-180 justify-center items-center duration-700"
                            style={{
                                backgroundImage: `url(${data.card.back.url})`,
                                backgroundSize: "contain",
                                backgroundRepeat: "no-repeat",
                                backgroundPosition: "center",
                                objectFit: "contain",
                                zIndex: isFlipped ? 1 : 0,
                            }}
                        ></div>
                    </div>
                </div>
                <div className="flex gap-2 w-full flex-wrap items-center justify-center absolute bottom-0 left-1/2 -translate-x-1/2">
                    <button
                        onClick={toggleFlip}
                        className=" group px-4 py-2 text-sm bg-slate-800/20 backdrop-blur-sm border border-slate-300 text-white rounded-full shadow-lg transform hover:scale-110 transition-all duration-300 ease-in-out flex items-center justify-center hover:gap-2"
                    >
                        <FlipHorizontal2 className="w-5 h-5" />
                        <p className="w-fit group-hover:block hidden leading-normal duration-200 overflow-hidden text-sm p-0 m-0">
                            Flip
                        </p>
                    </button>
                    <button
                        onClick={handleRotate(45)}
                        className=" group px-4 py-2 text-sm bg-slate-800/20 backdrop-blur-sm border border-slate-300 text-white rounded-full shadow-lg transform hover:scale-110 transition-all duration-300 ease-in-out flex items-center justify-center hover:gap-2"
                    >
                        <RotateCcw className="w-5 h-5" />
                        <p className="w-fit group-hover:block hidden leading-normal duration-200 overflow-hidden text-sm p-0 m-0">
                            Rotate left
                        </p>
                    </button>
                    <button
                        onClick={handleRotate(-45)}
                        className=" group px-4 py-2 text-sm bg-slate-800/20 backdrop-blur-sm border border-slate-300 text-white rounded-full shadow-lg transform hover:scale-110 transition-all duration-300 ease-in-out flex items-center justify-center hover:gap-2"
                    >
                        <RotateCw className="w-5 h-5" />
                        <p className="w-fit group-hover:block hidden leading-normal duration-200 overflow-hidden text-sm p-0 m-0">
                            Rotate right
                        </p>
                    </button>
                    <button
                        onClick={handleZoom(10)}
                        className=" group px-4 py-2 text-sm bg-slate-800/20 backdrop-blur-sm border border-slate-300 text-white rounded-full shadow-lg transform hover:scale-110 transition-all duration-300 ease-in-out flex items-center justify-center hover:gap-2"
                    >
                        <ZoomIn className="w-5 h-5" />
                        <p className="w-fit group-hover:block hidden leading-normal duration-200 overflow-hidden text-sm p-0 m-0">
                            Zoom In
                        </p>
                    </button>
                    <button
                        onClick={handleZoom(-10)}
                        className=" group px-4 py-2 text-sm bg-slate-800/20 backdrop-blur-sm border border-slate-300 text-white rounded-full shadow-lg transform hover:scale-110 transition-all duration-300 ease-in-out flex items-center justify-center hover:gap-2"
                    >
                        <ZoomOut className="w-5 h-5" />
                        <p className="w-fit group-hover:block hidden leading-normal duration-200 overflow-hidden text-sm p-0 m-0">
                            Zoom out
                        </p>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CardModal;
