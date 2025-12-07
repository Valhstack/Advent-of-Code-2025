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

    let input = [];
    let tachyonHit = 0;

    let counts = [];

    for (let i = 0; i < lines[0].length; i++) {
        counts[i] = 0;

        document.getElementById("count").innerText += counts[i];
    }

    for (let line of lines) {
        let newRow = [];
        for (let ch of line) {
            newRow.push(ch);
            document.getElementById("tree").innerText += ch;
        }

        document.getElementById("tree").innerText += "\n";
        input.push(newRow);
    }

    console.log("Parsed by character input: ", input);

    for (let i = 0; i < input.length; i++) {
        for (let j = 0; j < input[i].length; j++) {
            if (input[i][j] === "S") {
                counts[j] += 1;
                input[i + 1][j] = "|";

                document.getElementById("tree").innerText = "";

                for (let line of lines) {
                    for (let ch of line) {
                        document.getElementById("tree").innerText += ch;
                    }
                    document.getElementById("tree").innerText += "\n";
                }

                document.getElementById("count").innerText = "";

                for (let count of counts) {
                    document.getElementById("count").innerText += count;
                }

                i++;

                break;
            }

            if (input[i][j] === "^" && input[i - 1][j] === "|") {
                input[i][j - 1] = "|";
                input[i][j + 1] = "|";
                tachyonHit++;

                document.getElementById("tree").innerText = "";

                for (let line of lines) {
                    for (let ch of line) {
                        document.getElementById("tree").innerText += ch;
                    }
                    document.getElementById("tree").innerText += "\n";
                }

                counts[j - 1] += 1;
                counts[j + 1] += 1;
                counts[j] = 0;

                document.getElementById("count").innerText = "";

                for (let count of counts) {
                    document.getElementById("count").innerText += count;
                }
            }
            else if (input[i][j] === "." && i !== 0) {
                if (input[i - 1][j] === "|") {
                    input[i][j] = "|";

                    document.getElementById("tree").innerText = "";

                    for (let line of lines) {
                        for (let ch of line) {
                            document.getElementById("tree").innerText += ch;
                        }
                        document.getElementById("tree").innerText += "\n";
                    }
                }
            }
        }
    }

    console.log("With all the beams: ", input, " ; Total split counts: ", tachyonHit);

    /*for (let i = 0; i < input.length; i += 2) {
        for (let j = 0; j < input[i].length; j++) {
            if (input[i][j] === "S") {
                counts[j] += 1;
                break;
            }

            if (input[i][j] === "^") {
                counts[j - 1] += 1;
                counts[j + 1] += 1;
                counts[j] = 0;
            }
        }
    }*/

    let totalNumOfPath = counts.reduce((accumulator, currentValue) => {
        return accumulator + currentValue
    }, 0);

    console.log("Total number of path: ", totalNumOfPath);
})