async function fetchInput() {
    return await (await fetch("input.txt")).text();
}

async function fetchLines() {
    const response = await fetch("input.txt");
    const text = await response.text();  // this gives you the full file content as a string
    const lines = text.split(/\r?\n/);   // handles both Windows and Unix newlines
    return lines;
}

function countNeighbours(x, y, lines) {
    let count = 0;

    let rows = lines.length;
    let columns = lines[0].length;

    for (let i = x - 1; i <= x + 1; i++) {
        for (let j = y - 1; j <= y + 1; j++) {
            if (i === x && j === y) continue;

            if (i >= 0 && i < rows && j >= 0 && j < columns) {
                if (lines[i][j] === "@") count++;
            }
        }
    }

    return count;
}

fetchLines().then(lines => {
    console.log(lines);

    let rows = lines.length;
    let columns = lines[0].length;

    let totalAaccessible = 0, accessible = 1;

    while (accessible != 0) {
        accessible = 0;

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < columns; j++) {
                if (lines[i][j] === "@" && countNeighbours(i, j, lines) < 4) {
                    accessible++;
                    lines[i][j] === ".";
                }
            }
        }
    }

    console.log(lines);
    console.log(accessible);
})