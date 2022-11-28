import React, { ChangeEvent, useEffect, useState } from "react";
import BoggleBoard from "../Components/BoggleBoard";
import MainLayout from "../Layouts/MainLayout";
import { findWord, getBoardLayout } from "../Utils/utils";

export default function Home() {
    const [boardLayout, setBoardLayout] = useState<string[]>([
        ..."abcdefghijklmnopqrstuvwxy".toUpperCase(),
    ]);
    const [inputValue, setInputValue] = useState<string>("");
    const [highlightPath, setHighlightPath] = useState<number[]>([]);

    const shuffleHandler = () => {
        setBoardLayout(getBoardLayout());
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.currentTarget.value.toUpperCase());
    };

    useEffect(() => {
        const result = findWord(inputValue, boardLayout, []);
        if (result) {
            setHighlightPath(result);
        } else {
            setHighlightPath([]);
        }
    }, [boardLayout, inputValue]);

    return (
        <MainLayout pageName="Home">
            <div className="flex flex-col items-center gap-4 mt-4">
                <BoggleBoard
                    boardLayout={boardLayout}
                    highlightPath={highlightPath}
                />
                <button
                    className="p-2 bg-blue-300 rounded-full hover:bg-blue-400"
                    onClick={shuffleHandler}
                >
                    Shuffle
                </button>
                <div className="flex items-center gap-4">
                    <div>Lookup</div>
                    <input
                        className="rounded-md"
                        type="text"
                        name="lookup"
                        id="lookup"
                        value={inputValue}
                        onChange={handleInputChange}
                    />
                </div>
            </div>
        </MainLayout>
    );
}
