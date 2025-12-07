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

    for (let line of lines) {
        let newRow = [];
        for (let ch of line) {
            newRow.push(ch);
        }

        input.push(newRow);
    }

    console.log("Parsed by character input: ", input);

    for (let i = 0; i < input.length; i++) {
        for (let j = 0; j < input[i].length; j++) {
            if (input[i][j] === "S") {
                i++;
                input[i][j] = "|";
                break;
            }

            if (input[i][j] === "^" && input[i - 1][j] === "|") {
                input[i][j - 1] = "|";
                input[i][j + 1] = "|";
                tachyonHit++;
            }
            else if (input[i][j] === "." && i !== 0) {
                if (input[i - 1][j] === "|") {
                    input[i][j] = "|";
                }
            }
        }
    }

    console.log("With all the beams: ", input, " ; Total split count: ", tachyonHit);

    // Convert array to a string (e.g., one item per line)
    const text = input.join("\n");

    // Create a Blob
    const blob = new Blob([text], { type: "text/plain" });

    // Create a temporary download link
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "myArray.txt";

    // Trigger download
    link.click();

    // Cleanup
    URL.revokeObjectURL(link.href);
})