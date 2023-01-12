import { DateTime } from "luxon";
import React, {
    ChangeEvent,
    KeyboardEventHandler,
    useEffect,
    useState,
} from "react";
import BoggleBoard from "../Components/BoggleBoard";
import Timer from "../Components/Timer";
import ValidWord from "../Components/ValidWord";
import MainLayout from "../Layouts/MainLayout";
import {
    findValidWords,
    findWord,
    getBoardLayout,
    lookupWord,
    WordPathType,
} from "../Utils/utils";

export default function Home() {
    const [boardLayout, setBoardLayout] = useState<string[]>([
        ..."abcdefghijklmnopqrstuvwxy".toUpperCase(),
    ]);
    const [inputValue, setInputValue] = useState<string>("");
    const [highlightPath, setHighlightPath] = useState<number[]>([]);
    const [lookupStatus, setLookupStatus] = useState<{
        working: boolean;
        definitionString: string;
    }>({ working: false, definitionString: "" });
    const [roundEndsAt, setRoundEndsAt] = useState<Date | null>(null);
    const [validWords, setValidWords] = useState<WordPathType[] | null>(null);
    const [showValidWords, setShowValidWords] = useState<boolean>(false);

    const shuffleHandler = () => {
        setShowValidWords(false);
        setInputValue("");
        setValidWords(null);
        const newLayout = getBoardLayout();
        setBoardLayout(newLayout);
        setLookupStatus({ working: false, definitionString: "" });
        setRoundEndsAt(DateTime.now().plus({ minutes: 3 }).toJSDate());
        setValidWords(findValidWords(newLayout));
    };

    const showValidWordsClickHandler = () => {
        setShowValidWords(!showValidWords);
    };

    const validWordMouseOverHandler = (word: string) => {
        setInputValue(word);
    };

    const validWordMouseClickHandler = async (word: string) => {
        setInputValue(word);
        setLookupStatus((prev) => ({ ...prev, working: true }));
        const result = await lookupWord(word);
        setLookupStatus({ working: false, definitionString: result });
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.currentTarget.value.toUpperCase());
    };

    const handleInputKeyDown: KeyboardEventHandler<HTMLInputElement> = async ({
        key,
    }) => {
        if (key === "Enter") {
            setLookupStatus((prev) => ({ ...prev, working: true }));
            const result = await lookupWord(inputValue);
            setLookupStatus({ working: false, definitionString: result });
        } else if (key === "Escape") {
            setInputValue("");
            setLookupStatus({ working: false, definitionString: "" });
        }
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
                <div className="text-2xl text-blue-700">Boggled</div>
                <Timer roundEndsAt={roundEndsAt} />
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
                        onKeyDown={handleInputKeyDown}
                    />
                </div>
                {!lookupStatus.working && (
                    <div className="p-2 mx-4">
                        {lookupStatus.definitionString}
                    </div>
                )}
                <button
                    className="p-2 bg-blue-300 rounded-full hover:bg-blue-400"
                    onClick={showValidWordsClickHandler}
                >{`${showValidWords ? "Hide" : "Show"} Valid Words`}</button>
                {showValidWords && validWords && (
                    <div className="flex flex-wrap gap-4">
                        {validWords.map((validWord) => (
                            <ValidWord
                                key={validWord.word}
                                wordPath={validWord}
                                mouseClickCallback={validWordMouseClickHandler}
                                mouseOverCallback={validWordMouseOverHandler}
                                active={
                                    inputValue.toUpperCase() === validWord.word
                                }
                            />
                        ))}
                    </div>
                )}
            </div>
        </MainLayout>
    );
}
