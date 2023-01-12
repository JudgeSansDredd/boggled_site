import React from "react";
import { WordPathType } from "../Utils/utils";

interface PropType {
    wordPath: WordPathType;
    mouseOverCallback: (word: string) => void;
    mouseClickCallback: (word: string) => void;
    active: boolean;
}

export default function ValidWord(props: PropType) {
    const mouseOverHandler: React.MouseEventHandler = (e) => {
        props.mouseOverCallback(props.wordPath.word);
    };

    const mouseClickHandler: React.MouseEventHandler = (e) => {
        props.mouseClickCallback(props.wordPath.word);
    };

    return (
        <button
            className={`p-2 ${
                props.active ? "bg-red-300" : "bg-purple-100"
            } rounded-full hover:bg-purple-300`}
            onMouseOver={mouseOverHandler}
            onClick={mouseClickHandler}
        >
            {props.wordPath.word}
        </button>
    );
}
