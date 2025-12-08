async function fetchInput() {
    return await (await fetch("input.txt")).text();
}

async function fetchLines() {
    const response = await fetch("input.txt");
    const text = await response.text();
    const lines = text.split(/\r?\n/);

    return lines;
}

function Point(X, Y, Z, index) {
    this.X = X;
    this.Y = Y;
    this.Z = Z;
    this.index = index;
}

function Distance(distance, indxPoint1, indxPoint2) {
    this.distance = distance;
    this.indxPoint1 = indxPoint1;
    this.indxPoint2 = indxPoint2;
}

fetchLines().then(lines => {
    console.log("Initial input: ", lines, "Total length: ", lines.length, "One row length: ", lines[0].length);

    let points = [], index = 0, distances = [];

    for (let line of lines) {
        let temp = line.split(",");
        points.push(new Point(temp[0], temp[1], temp[2], index++));
    }

    console.log("Points: ", points);

    for (let i = 0; i < points.length - 1; i++) {
        for (let j = i + 1; j < points.length; j++) {
            let distance = Math.sqrt(Math.pow((Number(points[i].X) - Number(points[j].X)), 2) + Math.pow((Number(points[i].Y) - Number(points[j].Y)), 2) + Math.pow((Number(points[i].Z) - Number(points[j].Z)), 2));
            distances.push(new Distance(distance, i, j));
        }
    }

    console.log("Distances: ", distances);

    distances.sort(function (a, b) { return a.distance - b.distance });

    console.log("Sorted distancies: ", distances);

    distances.sort((a, b) => a.distance - b.distance);

    // keep only 1000 shortest
    //distances = distances.slice(0, 1000);

    //console.log("Top 10 distances:", distances);

    // Build adjacency graph from ONLY the 10 shortest distances
    /*let graph = {};

    for (let d of distances) {
        const a = d.indxPoint1;
        const b = d.indxPoint2;

        if (!graph[a]) graph[a] = [];
        if (!graph[b]) graph[b] = [];

        graph[a].push(b);
        graph[b].push(a);
    }

    // DFS grouping
    let visited = new Set();

    function dfs(start) {
        let stack = [start];
        let group = [];

        while (stack.length > 0) {
            const node = stack.pop();
            if (visited.has(node)) continue;

            visited.add(node);
            group.push(node);

            if (graph[node]) {
                for (let next of graph[node]) {
                    if (!visited.has(next)) {
                        stack.push(next);
                    }
                }
            }
        }
        return group;
    }

    let circuits = [];

    for (let i = 0; i < points.length; i++) {
        if (!visited.has(i)) {
            circuits.push(dfs(i));
        }
    }

    circuits.sort((a, b) => b.length - a.length);

    console.log("Circuits:", circuits);

    let result = 1;

    for(let i = 0; i < 3; i++){
        result *= circuits[i].length;
    }

    console.log("Result: ", result);*/

    let parent = [...Array(points.length).keys()];

    function find(x) {
        return parent[x] === x ? x : parent[x] = find(parent[x]);
    }

    function union(a, b) {
        parent[find(b)] = find(a);
    }

    let lastA = null;
    let lastB = null;
    let circuitsCount = points.length;

    for (let d of distances) {
        let a = d.indxPoint1;
        let b = d.indxPoint2;

        if (find(a) !== find(b)) {
            union(a, b);
            circuitsCount--;

            lastA = a;
            lastB = b;

            if (circuitsCount === 1) break;  // THIS IS CRITICAL
        }
    }

    // Now lastA and lastB are the correct final pair

    let answer = points[lastA].X * points[lastB].X;
    console.log("Answer: ", answer);
})