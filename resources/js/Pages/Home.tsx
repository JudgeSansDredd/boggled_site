import { DateTime } from "luxon";
import React, {
    ChangeEvent,
    KeyboardEventHandler,
    useEffect,
    useState,
} from "react";
import BoggleBoard from "../Components/BoggleBoard";
import Timer from "../Components/Timer";
import MainLayout from "../Layouts/MainLayout";
import { findWord, getBoardLayout, lookupWord } from "../Utils/utils";

export default function Home() {
    const [boardLayout, setBoardLayout] = useState<string[]>([
        ..."abcdefghijklmnopqrstuvwxy".toUpperCase(),
    ]);
    const [inputValue, setInputValue] = useState<string>("");
    const [highlightPath, setHighlightPath] = useState<number[]>([]);
    const [lookupStatus, setLookupStatus] = useState<{
        working: Boolean;
        definitionString: string;
    }>({ working: false, definitionString: "" });
    const [roundEndsAt, setRoundEndsAt] = useState<Date | null>(null);

    const shuffleHandler = () => {
        setBoardLayout(getBoardLayout());
        setInputValue("");
        setLookupStatus({ working: false, definitionString: "" });
        setRoundEndsAt(DateTime.now().plus({ minutes: 3 }).toJSDate());
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
                    <div>{lookupStatus.definitionString}</div>
                )}
            </div>
        </MainLayout>
    );
}
