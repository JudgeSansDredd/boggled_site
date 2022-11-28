import React from "react";
import BoggleDie from "./BoggleDie";

interface PropType {
    boardLayout: string[];
    highlightPath: number[];
}

export default function Boggleboard(props: PropType) {
    const dice = props.boardLayout.map((d, i) => {
        return (
            <BoggleDie
                letter={d}
                key={`boggle-die-${i}`}
                highlighted={props.highlightPath.includes(i)}
            />
        );
    });

    return <div className="grid grid-rows-5, grid-cols-5 gap-2">{dice}</div>;
}
