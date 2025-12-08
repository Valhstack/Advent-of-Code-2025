async function fetchInput() {
    return await (await fetch("input.txt")).text();
}

async function fetchLines() {
    const response = await fetch("input.txt");
    const text = await response.text();
    const lines = text.split(/\r?\n/);

    return lines;
}

function Point(X, Y, Z, index){
    this.X = X;
    this.Y = Y;
    this.Z = Z;
    this.index = index;
}

function Distance(distance, indxPoint1, indxPoint2){
    this.distance = distance;
    this.indxPoint1 = indxPoint1;
    this.indxPoint2 = indxPoint2;
}

fetchLines().then(lines => {
    console.log("Initial input: ", lines, "Total length: ", lines.length, "One row length: ", lines[0].length);

    let points = [], index = 0, distances = [];

    for(let line of lines){
        let temp = line.split(",");
        points.push(new Point(temp[0], temp[1], temp[2], index++));
    }

    console.log("Points: ", points);

    for(let i = 0; i < points.length - 1; i++){
        let distance = Math.sqrt(Math.pow(points[i].X - points[i + 1].X) + Math.pow(points[i].Y - points[i + 1].Y) + Math.pow(points[i].Z - points[i + 1].Z));
        distances.push(new Distance(distance, i, i + 1));
    }

    console.log("Distances: ", distances);
})