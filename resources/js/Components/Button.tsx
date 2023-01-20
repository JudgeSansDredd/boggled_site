import React, { MouseEventHandler } from "react";

interface PropType {
    text: string;
    onClick?: MouseEventHandler<HTMLButtonElement>;
}

export default function Button(props: PropType) {
    const { text, onClick } = props;
    return (
        <button
            onClick={onClick}
            className="p-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500"
        >
            {text}
        </button>
    );
}
