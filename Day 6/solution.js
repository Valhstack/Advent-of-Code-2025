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
    console.log("Initial input: ", lines, "Total length: ", lines.length, "One row length: ", lines[0].length);

    // PART 1 solution for reversing array

    /*let splittedLines = lines.map(line =>
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

    let reversedLines = splittedLines[0].map((_, i) => splittedLines.map(row => row[i]));

    console.log("Reversed: ", reversedLines);

    let problemAnswer = [];

    for (let line of reversedLines) {
    let result = 0;
    let sign = line[line.length - 1];

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

    console.log("Result: ", totalResult);*/

    let newArr = [];
    let signs = [];

    for (let line of lines) {
        let newRow = [];
        for (let i = 0; i < line.length; i++) {
            if (line[i] === "*" || line[i] === "+") {
                signs.push(line[i]);
            }
            else {
                newRow.push(line[i]);
            }
        }

        newArr.push(newRow)
    }

    console.log("newArr: ", newArr);
    console.log("Signs: ", signs);

    let newArr2 = [];

    for (let i = 0; i < newArr[0].length; i++) {
        let newRow = [];
        for (let j = 0; j < newArr.length - 1; j++) {
            newRow.push(newArr[j][i]);
        }

        newArr2.push(newRow);
    }

    console.log("newArr2:", newArr2);

    const result = [];
    let currentGroup = [];

    for (const row of newArr2) {
        // Check if row is blank (all spaces or empty)
        const isBlank = row.every(x => x.trim() === "");

        if (isBlank) {
            // end current group if it has content
            if (currentGroup.length > 0) {
                result.push(currentGroup);
                currentGroup = [];
            }
            continue;
        }

        // join the row into a number
        const num = Number(row.join("").trim());
        currentGroup.push(num);
    }

    // push last group if exists
    if (currentGroup.length > 0) {
        result.push(currentGroup);
    }

    let problemAnswer = [];

    for (let i = 0; i < signs.length; i++) {
        let tempResult = 0;

        if (signs[i] === "*") tempResult = 1;
        else tempResult = 0;

        for (let j = 0; j < result[i].length; j++) {
            if (signs[i] === "*") tempResult *= Number(result[i][j]);
            else tempResult += Number(result[i][j]);
        }

        console.log(tempResult);
        problemAnswer.push(tempResult);
    }

    let totalResult = 0;

    for (let answer of problemAnswer) {
        totalResult += Number(answer);
    }

    console.log("Total Result: ", totalResult);
})