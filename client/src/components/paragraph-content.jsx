import { AlignCenter, AlignJustify, AlignLeft, AlignRight } from "lucide-react";
import { useRef, useState } from "react";

const STYLES_BUTTONS = [
    {
        icon: AlignLeft,
        av: {
            textAlign: "left",
        },
    },
    {
        icon: AlignCenter,
        av: {
            textAlign: "center",
        },
    },
    {
        icon: AlignRight,
        av: {
            textAlign: "right",
        },
    },
    {
        icon: AlignJustify,
        av: {
            textAlign: "justify",
        },
    },
];

export default function ParagraphContent({ paragraph, isEditing, onChange }) {
    const textRef = useRef();

    const handleChange = (e) => {
        if (textRef) {
            const textarea = textRef.current;
            textarea.style.height = "auto";
            textarea.style.height = `${textarea.scrollHeight}px`;
            onChange({
                ...paragraph,
                value: e.target.value,
            });
        }
    };

    const toggleStyles =
        (av, paragraph = {}) =>
        () => {
            const newStyles = isSelectStyles(av, paragraph.styles || {})
                ? Object.fromEntries(
                      Object.entries(paragraph.styles || {}).filter(
                          ([key]) => !(key in av)
                      )
                  )
                : { ...(paragraph.styles || {}), ...av };

            onChange({
                ...paragraph,
                ...(Object.keys(newStyles).length > 0
                    ? { styles: newStyles }
                    : {}), // remove styles if empty
            });
        };

    const isSelectStyles = (av, styles = {}) => {
        return Object.entries(av).every(
            ([key, value]) => styles[key] === value
        );
    };

    return (
        <div>
            {isEditing ? (
                <>
                    <div className="w-full flex flex-wrap items-center justify-start gap-2 mb-2">
                        {STYLES_BUTTONS.map(({ icon: Icon, av }) => (
                            <button
                                className={`w-8 aspect-square rounded p-2 border border-slate-300 dark:border-slate-600  dark:hover:bg-slate-600 ${
                                    isSelectStyles(av, paragraph?.styles || {})
                                        ? "bg-slate-800 text-slate-50 dark:text-slate-800 dark:bg-slate-50 hover:bg-slate-600 dark:hover:bg-slate-200"
                                        : "bg-transparent hover:bg-slate-300"
                                }`}
                                onClick={toggleStyles(av, paragraph)}
                            >
                                <Icon size={15} />
                            </button>
                        ))}
                    </div>
                    <textarea
                        ref={textRef}
                        className="w-full h-auto resize-none text-sm bg-slate-50 dark:bg-slate-800 focus:right-0 focus:outline-none border border-slate-300 dark:border-slate-600 rounded-md p-2 md:p-3"
                        cols={2}
                        value={paragraph?.value}
                        onChange={handleChange}
                        style={paragraph?.styles || {}}
                    />
                </>
            ) : (
                <p className="text-sm break-words w-full text-left">
                    {paragraph?.value}
                </p>
            )}
        </div>
    );
}
