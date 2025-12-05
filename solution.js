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

    for(let range of ranges){
        for(let i = Number(range[0]); i <= Number(range[1]); i++){
            allIds.push(i);
        }
    }

    let allUniqueIDs = [...new Set(allIds)];

    console.log("Total count: ", allUniqueIDs.length);
})