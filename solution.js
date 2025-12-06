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

    let splittedLines = lines.map(line =>
        line.split(/\s+/g).filter(el => el !== "")
    );

    console.log(splittedLines);

    for (let i = 0; i < splittedLines.length; i++) {
        let newRow = [];
        for (let j = 0; j < splittedLines[i].length; j++) {
            newRow.push(splittedLines[j][i]);
        }
        reversedLines.push(newRow);
    }

    console.log("Reversed: ", reversedLines);

    let problemAnswer = [];

    for (let line of reversedLines) {
        let result = 0;
        let sign = line[length - 1];

        if (sign === "*") result = 1;
        else result = 0;

        for (let i = 0; i < line.length - 1; i++) {
            if (sign === "*") result *= Number(line[i]);
            else result += Number(line[i]);
        }

        console.log(result);
        problemAnswer.push(result);
    }

    let totalResult = 0;

    console.log(problemAnswer);

    for (let answer of problemAnswer) {
        totalResult += Number(answer);
    }

    console.log("Result: ", totalResult);
})