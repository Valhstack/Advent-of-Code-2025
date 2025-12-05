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

    for (let line of lines) {
        let arr = [];

        for (let ch of line) {
            arr.push(Number(ch));
        }

        console.log(arr);

        let max = Math.max(...arr.slice(1, arr.length - 1));

        voltageLine = arr[0].toString() + max.toString();
        let temp1 = "";

        for (let i = 1; i < arr.length - 1; i++) {
            max = Math.max(...arr.slice(i + 1, length - 1));
            temp1 = arr[i].toString() + max.toString();

            if (temp1 > voltageLine) {
                voltageLine = temp1;
            }

            temp1 = "";
        }

        voltageTotal += Number(voltageLine);
        voltageLine = "";
    }

    console.log("Total output voltage: ", voltageTotal);
})