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

    for(let line of lines){
        let newRow = [];
        for(let ch of line){
            newRow.push(ch);
        }

        input.push(newRow);
    }

    console.log("Parsed by character input: ", input);

    for(let i = 0; i < input.length; i++){
        for(let j = 0; j < input[i].length; j++){
            if(input[i][j] === "S"){
                i++;
                input[i][j] = "|";
                break;
            }

            if(input[i][j] === "^"){
                input[i][j - 1] = "|";
                input[i][j + 1] = "|";
            }
            else if(input[i][j] === "."){
                if(input[i - 1][j] === "|"){
                    input[i][j] = "|";
                }
            }
        }
    }

        console.log("First beam should be in: ", input);
})