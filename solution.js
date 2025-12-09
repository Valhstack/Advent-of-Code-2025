async function fetchInput() {
    return await (await fetch("input.txt")).text();
}

async function fetchLines() {
    const response = await fetch("input.txt");
    const text = await response.text();
    const lines = text.split(/\r?\n/);

    return lines;
}

function Point(X, Y, index) {
    this.X = X;
    this.Y = Y;
    this.index = index;
}

function Area(area, point1, point2) {
    this.area = area;
    this.point1 = point1;
    this.point2 = point2;
}

// -------------------- Helper: Check if point is on line segment --------------------
function isPointOnLine(point, a, b, epsilon = 1e-10) {
    const cross = (b.X - a.X) * (point.Y - a.Y) - (b.Y - a.Y) * (point.X - a.X);
    if (Math.abs(cross) > epsilon) return false;

    const dot = (point.X - a.X) * (b.X - a.X) + (point.Y - a.Y) * (b.Y - a.Y);
    if (dot < 0) return false;

    const lenSq = (b.X - a.X) ** 2 + (b.Y - a.Y) ** 2;
    if (dot > lenSq) return false;

    return true;
}

// -------------------- Point inside polygon OR on edge --------------------
function isPointInPolygonOrOnEdge(point, polygon) {
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        if (isPointOnLine(point, polygon[j], polygon[i])) return true;
    }

    // Ray-casting algorithm
    let x = point.X, y = point.Y;
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        let xi = polygon[i].X, yi = polygon[i].Y;
        let xj = polygon[j].X, yj = polygon[j].Y;
        let intersect = ((yi > y) !== (yj > y)) &&
            (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }
    return inside;
}

// -------------------- Rectangle from 2 edge points --------------------
function getRectangleCorners(p1, p2) {
    return [
        { x: p1.X, y: p1.Y },
        { x: p2.X, y: p1.Y },
        { x: p1.X, y: p2.Y },
        { x: p2.X, y: p2.Y }
    ];
}

// -------------------- Check if rectangle is fully inside polygon --------------------
function isRectangleInsidePolygon(p1, p2, polygon) {
    const corners = getRectangleCorners(p1, p2);
    return corners.every(corner => isPointInPolygonOrOnEdge(corner, polygon));
}

fetchLines().then(lines => {
    console.log("Initial input: ", lines, "Total length: ", lines.length, "One row length: ", lines[0].length);

    let points = [], index = 0;

    for (let line of lines) {
        let temp = line.split(",");
        points.push(new Point(temp[0], temp[1], index++));
    }

    console.log("Points: ", points);

    // PART 1 solution
    /*let maxArea = 0;

    for(let i = 0; i < points.length; i++)
    {
        for(let j = i + 1; j < points.length; j++){
            let area = (Math.abs(points[i].X - points[j].X) + 1) * (Math.abs(points[i].Y - points[j].Y) + 1);
            if(area > maxArea) maxArea = area;
        }
    }

    console.log("Max area: ", maxArea);*/

    // PART 2 solution
    const center = points.reduce((acc, { X, Y }) => {
        acc.X += X / points.length;
        acc.Y += Y / points.length;
        return acc;
    }, { X: 0, Y: 0 });

    console.log("Center: ", center);

    const angles = points.map(p => ({
        ...p,
        angle: Math.atan2(p.Y - center.Y, p.X - center.X) * 180 / Math.PI
    }));

    const pointsSorted = angles
        .sort((a, b) => a.angle - b.angle)
        .map((p, newIndex) => ({
            ...p,
            newIndex
        }));

    console.log("Points sorted: ", pointsSorted);

    let areas = [];

    for (let i = 0; i < pointsSorted.length; i++) {
        for (let j = i + 1; j < pointsSorted.length; j++) {
            let area = (Math.abs(pointsSorted[i].X - pointsSorted[j].X) + 1) * (Math.abs(pointsSorted[i].Y - pointsSorted[j].Y) + 1);
            areas.push(new Area(area, pointsSorted[i], pointsSorted[j]));
        }
    }

    const areasSorted = areas.sort((a, b) => b.area - a.area);

    console.log("All areas sorted: ", areasSorted);

    let maxArea = "";

    for(let area of areasSorted){
        if(isRectangleInsidePolygon(area.point1, area.point2, pointsSorted)){
            maxArea = area.area;
            break;
        }
    }

    console.log("Biggest area now: ", maxArea);
})