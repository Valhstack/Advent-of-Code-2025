async function fetchInput() {
    return await (await fetch("input.txt")).text();
}

async function fetchLines() {
    const response = await fetch("input.txt");
    const text = await response.text();  // this gives you the full file content as a string
    const lines = text.split(/\r?\n/);   // handles both Windows and Unix newlines
    return lines;
}

fetchLines().then(lines => {
    let voltageLine = "", voltageTotal = 0;

    for(let line of lines){
        let max1 = Number(line[0]), max2 = Number(line[1]);

        for(let i = 2; i < line.length; i++){
            if(Number(line[i]) > max1){
                max2 = max1;
                max1 = Number(line[i]);
                max2 = Number(line[i + 1]);
            }
            else if(Number(line[i]) > max2){
                max2 = Number(line[i]);
            }
        }

        for(let ch of line){
            if(Number(ch) === max1 || Number(ch) === max2){
                voltageLine += ch;
            }
        }

        voltageTotal += Number(voltageLine);
        voltageLine = "";
    }

    console.log("Total output voltage: ", voltageTotal);
})