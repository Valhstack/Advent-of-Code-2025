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

        if (arr.length === 0) continue;

        // Solution for Part 1

        /*let max = Math.max(...arr.slice(1, arr.length));

        voltageLine = arr[0].toString() + max.toString();
        let temp1 = "";

        for (let i = 1; i < arr.length - 1; i++) {
            max = Math.max(...arr.slice(i + 1, arr.length));
            temp1 = arr[i].toString() + max.toString();

            if (Number(temp1) > Number(voltageLine)) {
                voltageLine = temp1;
            }

            temp1 = "";
        }*/

        // Solution for Part 2

        let needed = 12;
        let start = 0;
        let voltageLine = "";

        while (needed > 0) {
            let end = arr.length - needed;      // inclusive

            let window = arr.slice(start, end + 1);
            let max = Math.max(...window);

            voltageLine += max;

            let indx = start + window.indexOf(max);

            start = indx + 1;
            needed--;
        }

        voltageTotal += Number(voltageLine);
        voltageLine = "";
    }

    console.log("Total output voltage: ", voltageTotal);
})