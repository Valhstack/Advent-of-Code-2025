async function fetchLines() {
    const response = await fetch("input.txt");
    const text = await response.text();
    return text.split(/\r?\n/);
}

// Delay helper
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Render the grid with highlight efficiently
async function renderGrid(input, highlightRow, highlightCol) {
    const tree = document.getElementById("tree");
    let html = "";

    for (let row = 0; row < input.length; row++) {
        for (let col = 0; col < input[row].length; col++) {
            if (row === highlightRow && col === highlightCol) {
                html += `<span class="highlight">${input[row][col]}</span>`;
            } else {
                html += `<span>${input[row][col]}</span>`;
            }
        }
        html += "<br>";
    }

    tree.innerHTML = html;
    await delay(50); // Reduced delay for smoother animation
}

// Render counts efficiently
async function renderCounts(counts, highlightIndex) {
    const countDiv = document.getElementById("count");
    let html = "";

    for (let i = 0; i < counts.length; i++) {
        if (i === highlightIndex) {
            html += `<span class="highlight">${counts[i]}</span>`;
        } else {
            html += `<span>${counts[i]}</span>`;
        }
        html += " "; // optional spacing between numbers
    }

    countDiv.innerHTML = html;
    await delay(50);
}

// Main animation
(async function run() {
    const lines = await fetchLines();

    console.log("Initial input: ", lines, "Total length:", lines.length, "One row length:", lines[0].length);

    let input = [];
    let tachyonHit = 0;
    let counts = [];

    // Initialize counts
    for (let i = 0; i < lines[0].length; i++) {
        counts[i] = 0;
    }

    // Convert lines into char grid array
    for (let line of lines) {
        input.push(line.split(""));
    }

    console.log("Parsed char input: ", input);

    // Start simulation
    for (let i = 0; i < input.length; i++) {
        for (let j = 0; j < input[i].length; j++) {

            // ---- Case S ----
            if (input[i][j] === "S") {
                counts[j] += 1;
                input[i + 1][j] = "|";

                await renderGrid(input, i, j);
                await renderCounts(counts, j);

                i++; // skip one row
                break;
            }

            // ---- Case ^ with | above -> split ----
            if (input[i][j] === "^" && input[i - 1]?.[j] === "|") {
                let incoming = counts[j];
                input[i][j - 1] = "|";
                input[i][j + 1] = "|";
                tachyonHit++;

                counts[j - 1] += incoming;
                counts[j + 1] += incoming;
                counts[j] = 0;

                await renderGrid(input, i, j);
                await renderCounts(counts, j);
            }

            // ---- Case . but a beam is above -> extend ----
            else if (input[i][j] === "." && i !== 0) {
                if (input[i - 1][j] === "|") {
                    input[i][j] = "|";

                    await renderGrid(input, i, j);
                }
            }
        }
    }

    console.log("Final beams: ", input, "Total splits: ", tachyonHit);

    // Sum all paths
    let totalNumOfPath = counts.reduce((a, b) => a + b, 0);
    console.log("Total number of paths: ", totalNumOfPath);

    document.getElementById("result").innerText = totalNumOfPath;
})();