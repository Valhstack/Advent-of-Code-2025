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

    let count = [];

    for(let i = 0; i < lines[0].length; i++){
        count[i] = 0;
    }

    for (let line of lines) {
        let newRow = [];
        for (let ch of line) {
            newRow.push(ch);
        }

        input.push(newRow);
    }

    console.log("Parsed by character input: ", input);

    /*for (let i = 0; i < input.length; i++) {
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

    console.log("With all the beams: ", input, " ; Total split count: ", tachyonHit);*/

    for(let i = 0; i < input.length; i += 2){
        for(let j = 0; j < input[i].length; j++){
            if(input[i][j] === "S"){
                count[j] += 1;
                break;
            }
            
            if(input[i][j] !== "."){
                count[j - 1] += 1;
                count[j + 1] += 1;
                count[j] = 0;
            }
        }
    }
    
    let totalNumOfPath = count.reduce((accumulator, currentValue) => {
        return accumulator + currentValue
    }, 0);

    console.log("Total number of path: ", totalNumOfPath);
})