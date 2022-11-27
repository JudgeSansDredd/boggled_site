import React from "react";
import BoggleDie from "./BoggleDie";

interface PropType {
    boardLayout: string;
}

export default function Boggleboard(props: PropType) {
    const boardArray = [...props.boardLayout];
    const dice = boardArray.map((d, i) => {
        return (
            <BoggleDie letter={d} key={`boggle-die-${i}`} highlighted={false} />
        );
    });

    return <div className="grid grid-rows-5, grid-cols-5 gap-2">{dice}</div>;
}
