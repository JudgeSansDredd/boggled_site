import axios from "axios";
import { dictionary } from "./dictionary_filtered";

export type BoardSizeType = "big" | "superbig";
export const BOARD_SIZES = {
    big: 5,
    superbig: 6,
};

const DIE_SIZE = 6;

const DICE = {
    big: [
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
    ],
    superbig: [
        "ESUNSS",
        "VWOGRR",
        "TTOMET",
        "CPITES",
        "DNHDTO",
        "LORHND",
        "UNIOAE",
        "CUNYGF",
        "ROHSTP",
        "MGNAEN",
        "GUMEAE",
        "WUOTON",
        "SRVTHI",
        "ITECIT",
        "OOTTUO",
        "HDNHWO",
        "ENANND",
        "ESLITI",
        "CTNECS",
        "AEEAEE",
        "SYARIF",
        "OBAEID",
        "QXJZWK",
        "AAOOEE",
        "FARASA",
        "ZXBBJK",
        "EEMEEA",
        "LROHDH",
        "PYRYSI",
        "RIASAF",
        "IMEALN",
        "ESLHIR",
        "LPITSE",
        "DNLCDN",
        "OEI   ",
        "HETHERINANQU",
    ],
};

export function getBoardLayout(size: "big" | "superbig"): string[] {
    const shuffled = DICE[size]
        .map((d) => ({ sort: Math.random(), value: d })) // Addd sort key
        .sort((a, b) => a.sort - b.sort) // Sort by key
        .map((d) => d.value); // Remove sort key
    const rolled = shuffled.map((d) => {
        const sideWidth = d.length / DIE_SIZE;
        const randomSideNumber =
            Math.floor(Math.random() * DIE_SIZE) * sideWidth;
        return d.slice(randomSideNumber, randomSideNumber + sideWidth);
    }); // Get random letter from each
    return rolled;
}

interface RowColType {
    row: number;
    col: number;
}

export interface WordPathType {
    word: string;
    path: number[];
}

function rowColToNum(
    { row, col }: RowColType,
    boardSize: BoardSizeType
): number {
    return row * BOARD_SIZES[boardSize] + col;
}

export function findValidWords(
    boardLayout: string[],
    boardSize: BoardSizeType
): WordPathType[] {
    return dictionary
        .map((word) => {
            const path = findWord(word, boardLayout, boardSize, []);
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
    boardSize: BoardSizeType,
    path: RowColType[]
): number[] | false {
    const sideSize = BOARD_SIZES[boardSize];
    if (!word.length) {
        return false;
    }
    if (!path.length) {
        // We're just starting!
        const DQdWord = word.replace("QU", "Q");
        for (let row = 0; row < sideSize; row++) {
            for (let col = 0; col < sideSize; col++) {
                const result = findWord(DQdWord, boardLayout, boardSize, [
                    { row, col },
                ]);
                if (result) {
                    return result;
                }
            }
        }
        return false;
    } else {
        // Checking the letters so far...
        // Make a path-word out of the path coords
        const pathWord = path
            .map((p) => boardLayout[rowColToNum(p, boardSize)])
            .join("");
        // Make an abbreviated word out of the needle, but x characters long (based on length of path)
        const wordAbbrev = word.substring(0, pathWord.length);

        // These do not match, return up the stack
        if (pathWord !== wordAbbrev) {
            return false;
        }
        // They match, is it an entire match?
        if (pathWord === word) {
            const numPath = path.map((p) => rowColToNum(p, boardSize));
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
            const result = findWord(word, boardLayout, boardSize, [
                ...path,
                { row: row - 1, col },
            ]);
            if (result) {
                return result;
            }
        }
        if (row < 4 && !path.some((p) => p.row === row + 1 && p.col === col)) {
            // Search row + 1
            const result = findWord(word, boardLayout, boardSize, [
                ...path,
                { row: row + 1, col },
            ]);
            if (result) {
                return result;
            }
        }
        if (col > 0 && !path.some((p) => p.row === row && p.col === col - 1)) {
            // Search col - 1
            const result = findWord(word, boardLayout, boardSize, [
                ...path,
                { col: col - 1, row },
            ]);
            if (result) {
                return result;
            }
        }
        if (col < 4 && !path.some((p) => p.row === row && p.col === col + 1)) {
            // Search col + 1
            const result = findWord(word, boardLayout, boardSize, [
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
