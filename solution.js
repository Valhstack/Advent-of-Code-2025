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

    lines = lines.split(/\s*/g);

    for(let i = 0; i < lines.length; i++){
        for(let j = 0; j < lines[i].length; j++){
            reversedLines.push(lines[j][i]);
        }
    }

    console.log("Reversed: ", reversedLines)
})