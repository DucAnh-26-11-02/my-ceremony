import { useEffect, useState } from "react";
import ImageContent from "./image-content";
import BulletContent from "./bullet-content";
import HeadingContent from "./heading-content";
import ParagraphContent from "./paragraph-content";

const MODIFY_CONTENT_STATES = {
    IDLE: "IDLE",
    EDITING: "EDITING",
};

const CONTENT_STATES = {
    IDLE: "IDLE",
    TYPING: "TYPING",
    UPLOADING_IMAGE: "UPLOADING_IMAGE",
    UPLOADED_IMAGE: "UPLOADED_IMAGE",
    ERROR_UPLOAD_IMAGE: "ERROR_UPLOAD_IMAGE",
    DELETING_IMAGE: "DELETING_IMAGE",
    DELETED_IMAGE: "DELETED_IMAGE",
    ERROR_DELETE_IMAGE: "ERROR_UPLOAD_IMAGE",
};

const CONTENT_TYPES = {
    IMAGE: "IMAGE",
    HEADING: "HEADING",
    PARAGRAPH: "PARAGRAPH",
    BULLET: "BULLET",
};

const BUTTON_TYPES = [
    {
        type: CONTENT_TYPES.HEADING,
        text: "Heading",
        icon: null,
    },
    {
        type: CONTENT_TYPES.PARAGRAPH,
        text: "Paragraph",
        icon: null,
    },
    {
        type: CONTENT_TYPES.BULLET,
        text: "Bullet",
        icon: null,
    },
    {
        type: CONTENT_TYPES.IMAGE,
        text: "Image",
        icon: null,
    },
];

export default function ModifyContentCard({
    mode = "create",
    initContent = null,
    isEditing = false,
    getId = () => 1,
    onConfirm,
}) {
    const [content, setContent] = useState(null);
    const [modifyState, setModifyState] = useState(
        MODIFY_CONTENT_STATES[isEditing ? "EDIT" : "EDITING"]
    );
    const [contentState, setContentState] = useState(CONTENT_STATES.IDLE);

    const getInitData = (id) => {
        return mode === "update"
            ? initContent
            : {
                  id: getId(),
                  type: BUTTON_TYPES.at(0).type,
                  isNew: true,
              };
    };

    const reset = () => {
        setContent(getInitData());
        setContentState(CONTENT_STATES.IDLE);
    };

    const handleChangeContent = (type) => (data) => {
        setContent((content) => ({
            ...content,
            [type]: data,
        }));
    };

    const handleConfirm = () => {
        onConfirm(content);
        setModifyState(CONTENT_STATES.IDLE);
        reset();
    };

    const handleDelete = () => {
        onConfirm({
            ...content,
            isDelete: true,
        });
    };

    const handleCancel = () => {
        setModifyState(CONTENT_STATES.IDLE);
        reset();
    };

    const handleSelectContentType = (type) => () => {
        if (!CONTENT_TYPES[type]) return;

        setContent((c) => ({
            ...c,
            type,
        }));
    };

    useEffect(() => {
        setContent(getInitData());
    }, [initContent]);

    return (
        <div className="flex flex-col gap-2">
            {isEditing && (
                <div className="w-full flex gap-2 group duration-75">
                    {BUTTON_TYPES.map(({ type, icon: Icon, text }) => (
                        <button
                            onClick={handleSelectContentType(type)}
                            className={`duration-75 flex gap-2 items-center px-3 py-2 border rounded-md justify-center ${
                                content?.type === type
                                    ? "dark:bg-white bg-slate-800 dark:text-slate-800 text-slate-50 border-slate-300 dark:border-slate-600 text-sm hover:bg-slate-400 dark:hover:bg-slate-200 flex-1 font-bold"
                                    : `bg-transparent border-slate-300 dark:border-slate-600 text-sm hover:bg-slate-200 dark:hover:bg-slate-700 ${
                                          !!content ? "flex-0" : "flex-1"
                                      }`
                            }`}
                        >
                            {!!Icon && <Icon size={15} />}
                            {text}
                        </button>
                    ))}
                </div>
            )}
            <div
                className={`w-full rounded-lg ${
                    isEditing
                        ? "bg-slate-200 dark:bg-slate-700"
                        : "border border-slate-300 dark:border-slate-500"
                } box-border p-3`}
            >
                <RenderContent
                    content={content}
                    isEditing={isEditing}
                    onChange={handleChangeContent}
                />
                {isEditing && (
                    <div className="w-full flex gap-2">
                        {mode === "create" && (
                            <button
                                onClick={handleCancel}
                                className="w-fit p-2 px-5 rounded-md bg-slate-50 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-900"
                            >
                                Cancel
                            </button>
                        )}
                        {mode === "update" && (
                            <button
                                onClick={handleDelete}
                                className="w-fit p-2 px-5 rounded-md dark:bg-red-800 dark:hover:bg-red-900 bg-red-600 hover:bg-red-500 text-slate-50"
                            >
                                Remove
                            </button>
                        )}
                        <button
                            onClick={handleConfirm}
                            className="w-fit p-2 px-5 rounded-md dark:bg-slate-50 dark:hover:bg-slate-200 bg-slate-800 hover:bg-slate-900 text-slate-50 dark:text-slate-800"
                        >
                            Confirm
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

function RenderContent({ content, isEditing, onChange }) {
    switch (content?.type) {
        case CONTENT_TYPES.IMAGE:
            return (
                <ImageContent
                    image={content.image}
                    isEditing={isEditing}
                    onChange={onChange("image")}
                />
            );

        case CONTENT_TYPES.BULLET:
            return (
                <BulletContent
                    bullet={content.bullet}
                    isEditing={isEditing}
                    onChange={onChange("bullet")}
                />
            );

        case CONTENT_TYPES.HEADING:
            return (
                <HeadingContent
                    heading={content.heading}
                    isEditing={isEditing}
                    onChange={onChange("heading")}
                />
            );

        case CONTENT_TYPES.PARAGRAPH:
            return (
                <ParagraphContent
                    paragraph={content.paragraph}
                    isEditing={isEditing}
                    onChange={onChange("paragraph")}
                />
            );

        default:
            return null;
    }
}
