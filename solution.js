async function fetchInput() {
    return await (await fetch("input.txt")).text();
}

async function fetchLines() {
    const response = await fetch("input.txt");
    const lines = await response.text();
    return lines;
}

fetchLines().then(lines => {
    console.log(lines);

    const splitted = lines.split("\n\n");

    let ranges = splitted[0].split("\n");
    let ingredients = splitted[1].split("\n");
    let allIds = [];

    let freshCount = 0;

    console.log(ranges);
    console.log(ingredients);

    // Part 1 solution

    /* for (let ingredient of ingredients) {
        for (let range of ranges) {
            range = range.split("-");
            console.log(range)

            if (Number(ingredient) >= Number(range[0]) && Number(ingredient) <= Number(range[1])) {
                freshCount++;
                break;
            }
        }
    }*/

    // Part 2 solution
    const bigRanges = ranges.map(r => r.split("-").map(BigInt));

    bigRanges.sort((a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0));

    let merged = [];
    for (let [start, end] of bigRanges) {
        if (merged.length === 0) {
            merged.push([start, end]);
        } else {
            let last = merged[merged.length - 1];
            if (start <= last[1] + 1n) {
                // Overlapping or contiguous, merge them
                last[1] = last[1] > end ? last[1] : end;
            } else {
                merged.push([start, end]);
            }
        }
    }

    // Count unique IDs
    let totalCount = 0n;
    for (let [start, end] of merged) {
        totalCount += end - start + 1n;
    }

    console.log("Total count: ", totalCount);
})