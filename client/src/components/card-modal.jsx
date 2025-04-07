import { useState, useEffect, useRef } from "react";
import { RotateCcw } from "lucide-react"; // Import Lucide icons

function CardModal({ card, onClose }) {
    const [isFlipped, setIsFlipped] = useState(false);
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

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div
                ref={modalRef}
                className="relative w-full max-w-3xl p-5 bg-transparent rounded-lg flex flex-col justify-center items-center"
            >
                {/* 3D flip container */}
                <div
                    className={`relative w-full h-80 md:h-96 lg:h-[500px] perspective-1000`}
                >
                    <div
                        className={`w-full h-full absolute transform-style-preserve-3d transition-transform duration-700 ease-in-out ${
                            isFlipped ? "rotate-y-180" : ""
                        }`}
                    >
                        {/* Front of the card */}
                        <div
                            className="absolute w-full h-full backface-hidden flex justify-center items-center"
                            style={{
                                backgroundImage: `url(${card.front.url})`,
                                backgroundSize: "contain",
                                backgroundRepeat: "no-repeat",
                                backgroundPosition: "center",
                                objectFit: "contain",
                            }}
                        ></div>

                        {/* Back of the card */}
                        <div
                            className="absolute w-full h-full backface-hidden rotate-y-180 flex justify-center items-center"
                            style={{
                                backgroundImage: `url(${card.back.url})`,
                                backgroundSize: "contain",
                                backgroundRepeat: "no-repeat",
                                backgroundPosition: "center",
                                objectFit: "contain",
                            }}
                        ></div>
                    </div>
                </div>

                {/* Flip button */}
                <button
                    onClick={toggleFlip}
                    className="mt-4 px-6 py-2 bg-transparent backdrop-blur-sm border border-slate-300 text-white rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out flex items-center justify-center gap-2"
                >
                    <RotateCcw className="w-5 h-5" />
                    Flip Card
                </button>
            </div>
        </div>
    );
}

export default CardModal;
