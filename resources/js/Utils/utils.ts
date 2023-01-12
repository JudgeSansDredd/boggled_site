import axios from "axios";
import { dictionary } from "./dictionary_filtered";

const DICE = [
    "RUGRWO",
    "TITEII",
    "USENSS",
    "ONWUOT",
    "IYPRRR",
    "PSIRFY",
    "HLRHDO",
    "OUOTTO",
    "HDDNTO",
    "AEAEEE",
    "FAIASR",
    "NNENDA",
    "KQXZBJ",
    "FAYISR",
    "ENGNMA",
    "ARASAF",
    "MEAEEE",
    "NSCTCE",
    "TTTEOM",
    "NRLHOD",
    "LETPIC",
    "NOLDHR",
    "GUEEMA",
    "CIEPTS",
    "CIIETL",
];

export function getBoardLayout(): string[] {
    const shuffled = DICE.map((d) => ({ sort: Math.random(), value: d })) // Addd sort key
        .sort((a, b) => a.sort - b.sort) // Sort by key
        .map((d) => d.value) // Remove sort key
        .map((d) => d[Math.floor(Math.random() * d.length)]); // Get random letter from each
    return shuffled;
}

interface RowColType {
    row: number;
    col: number;
}

export interface WordPathType {
    word: string;
    path: number[];
}

function rowColToNum({ row, col }: RowColType): number {
    return row * 5 + col;
}

export function findValidWords(boardLayout: string[]): WordPathType[] {
    return dictionary
        .map((word) => {
            const path = findWord(word, boardLayout, []);
            return { word, path };
        })
        .filter((fr) => fr.path !== false)
        .sort((a, b) => b.word.length - a.word.length) as {
        word: string;
        path: number[];
    }[];
}

export function findWord(
    word: string,
    boardLayout: string[],
    path: RowColType[]
): number[] | false {
    if (!word.length) {
        return false;
    }
    if (!path.length) {
        // We're just starting!
        const DQdWord = word.replace("QU", "Q");
        for (let row = 0; row < 5; row++) {
            for (let col = 0; col < 5; col++) {
                const result = findWord(DQdWord, boardLayout, [{ row, col }]);
                if (result) {
                    return result;
                }
            }
        }
        return false;
    } else {
        // Checking the letters so far...
        // Make a path-word out of the path coords
        const pathWord = path.map((p) => boardLayout[rowColToNum(p)]).join("");
        // Make an abbreviated word out of the needle, but x characters long (based on length of path)
        const wordAbbrev = word.substring(0, pathWord.length);

        // These do not match, return up the stack
        if (pathWord !== wordAbbrev) {
            return false;
        }
        // They match, is it an entire match?
        if (pathWord === word) {
            const numPath = path.map((p) => rowColToNum(p));
            return numPath;
        }
        // They match, but it isn't the entire word yet. Search l, r, u, d
        const last = path.at(-1);
        if (!last) {
            return false;
        }
        const { row, col } = last;
        if (row > 0 && !path.some((p) => p.row === row - 1 && p.col === col)) {
            // Search row - 1
            const result = findWord(word, boardLayout, [
                ...path,
                { row: row - 1, col },
            ]);
            if (result) {
                return result;
            }
        }
        if (row < 4 && !path.some((p) => p.row === row + 1 && p.col === col)) {
            // Search row + 1
            const result = findWord(word, boardLayout, [
                ...path,
                { row: row + 1, col },
            ]);
            if (result) {
                return result;
            }
        }
        if (col > 0 && !path.some((p) => p.row === row && p.col === col - 1)) {
            // Search col - 1
            const result = findWord(word, boardLayout, [
                ...path,
                { col: col - 1, row },
            ]);
            if (result) {
                return result;
            }
        }
        if (col < 4 && !path.some((p) => p.row === row && p.col === col + 1)) {
            // Search col + 1
            const result = findWord(word, boardLayout, [
                ...path,
                { col: col + 1, row },
            ]);
            if (result) {
                return result;
            }
        }
    }
    return false;
}

interface DefinitionType {
    meta: {
        id: string;
        uuid: string;
        sort: string;
        src: string;
        section: string;
        stems: string[];
        offensive: boolean;
    };
    hom: number;
    hwi: {
        hw: string;
        prs: {
            mw: string;
            sound: {
                audio: string;
                ref: string;
                stat: string;
            };
        }[];
    };
    fl: string;
    date: string;
    shortdef: string[];
}

export async function lookupWord(word: string): Promise<string> {
    // HACK: Remove X-Requested-With header before call, it's added by inertia but borks CORS here
    delete axios.defaults.headers.common["X-Requested-With"];
    const res = await axios.get(
        `https://dictionaryapi.com/api/v3/references/collegiate/json/${word}`,
        {
            params: { key: import.meta.env.VITE_DICTIONARY_API_KEY },
        }
    );
    const data = res.data as DefinitionType[] | string[];
    if (data.length) {
        if (typeof data[0] === "object") {
            const castData = data as DefinitionType[];
            return castData
                .map((d) => d.shortdef)
                .flat()
                .map((d, i) => `${i + 1}) ${d}`)
                .join(" ");
        } else {
            const castData = data as string[];
            const alternates = castData.join(", ");
            return `Did you mean?: ${alternates}`;
        }
    } else {
        return "";
    }
}
