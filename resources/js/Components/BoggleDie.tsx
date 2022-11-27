import React from "react";

interface PropType {
    letter: string;
    highlighted: boolean;
}

export default function BoggleDie(props: PropType) {
    const bgColor = props.highlighted ? "bg-green-600" : "bg-white";
    return (
        <div
            className={`flex items-center justify-center w-8 h-8 ${bgColor} border-2 border-black rounded-md`}
        >
            <div className="text-red-800">{props.letter}</div>
        </div>
    );
}
