import React from "react";

interface PropType {
    letter: string;
    highlighted: boolean;
}

export default function BoggleDie(props: PropType) {
    const bgColor = props.highlighted ? "bg-green-300" : "bg-white";
    return (
        <div
            className={`flex items-center justify-center w-16 h-16 ${bgColor} border-2 border-black rounded-md`}
        >
            <div className="text-2xl text-red-800 ">
                {props.letter}
                <span className="text-sm">
                    {props.letter === "Q" ? "u" : ""}
                </span>
            </div>
        </div>
    );
}
