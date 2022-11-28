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

export function getBoardLayout() {
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

function rowColToNum({ row, col }: RowColType): number {
    return row * 5 + col;
}

export function findWord(
    word: string,
    boardLayout: string[],
    path: RowColType[]
): number[] | false {
    if (!word.length) {
        console.log("No word provided");
        return false;
    }
    if (!path.length) {
        // We're just starting!
        for (let row = 0; row < 5; row++) {
            for (let col = 0; col < 5; col++) {
                console.log(`Searching row: ${row}, col: ${col}`);
                const result = findWord(word, boardLayout, [{ row, col }]);
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

        console.log(`pathWord: ${pathWord}`);
        console.log(`wordAbbrev: ${wordAbbrev}`);

        // These do not match, return up the stack
        if (pathWord !== wordAbbrev) {
            return false;
        }
        // They match, is it an entire match?
        if (pathWord === word) {
            const numPath = path.map((p) => rowColToNum(p));
            console.log(numPath);
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
