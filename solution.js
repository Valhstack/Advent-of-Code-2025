async function fetchInput() {
    return await (await fetch("input.txt")).text();
}

async function fetchLines() {
    const response = await fetch("input.txt");
    const text = await response.text();
    const lines = text.split(/\r?\n/);

    return lines;
}

fetchLines().then(lines => {
    console.log(lines);

    let reversedLines = [];
    let splittedLines = [];

    for (let line of lines) {
        splittedLines.push(line.split(/\s+/g));
    }

    splittedLines = splittedLines.filter(() => true);

    for (let i = 0; i < splittedLines.length; i++) {
        for (let j = 0; j < splittedLines[i].length; j++) {
            reversedLines.push(splittedLines[j][i]);
        }
    }

    console.log("Reversed: ", reversedLines)
})