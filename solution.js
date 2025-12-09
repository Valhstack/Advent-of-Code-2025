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

    // --- Helper functions ---

    function parseCoord(value) {
        const num = parseFloat(value);
        if (isNaN(num)) throw new Error(`Invalid coordinate value: ${value}`);
        return num;
    }

    function closeRing(coords) {
        if (!coords || coords.length < 3) throw new Error("Need at least 3 points to form a polygon");
        const first = coords[0];
        const last = coords[coords.length - 1];
        if (first[0] !== last[0] || first[1] !== last[1]) {
            coords.push([...first]); // close the ring
        }
        return coords;
    }

    function makeRectangle(p1, p2) {
        const x1 = parseCoord(p1.X);
        const y1 = parseCoord(p1.Y);
        const x2 = parseCoord(p2.X);
        const y2 = parseCoord(p2.Y);

        const coords = [
            [x1, y1],
            [x2, y1],
            [x2, y2],
            [x1, y2],
            [x1, y1] // close the ring
        ];

        return turf.polygon([coords]);
    }

    // --- MAIN POLYGON ---
    if (!pointsSorted || pointsSorted.length < 3) {
        throw new Error("pointsSorted is missing or has fewer than 3 points");
    }

    const mainCoords = closeRing(pointsSorted.map(p => [parseCoord(p.X), parseCoord(p.Y)]));
    const polygon = turf.polygon([mainCoords]);

    let rectanglesInPolygon = [];

    const areasSorted = areas.sort((a, b) => b.area - a.area);

    console.log("All areas sorted: ", areasSorted);

    let maxArea = "", pointIndx1, pointIndx2;

    // --- LOOP FOR RECTANGLES ---
    for (let area of areasSorted) {
        const rectangle = makeRectangle(area.point1, area.point2);

        if (turf.booleanContains(polygon, rectangle)) {
            rectanglesInPolygon.push(area);
        }
    }

    console.log("All rectangles in polygon: ", rectanglesInPolygon);

    //console.log("Biggest area now: ", maxArea, "; point 1 index: ", pointIndx1, "; point 2 index", pointIndx2);

    // --- Canvas setup ---
    const canvas = document.getElementById('canvas');
    if (!canvas) throw new Error("Canvas element not found!");
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error("Unable to get 2D context from canvas");

    // --- Helper functions ---
    function toCanvasCoords([x, y], scale = 50, offsetX = 50, offsetY = 50) {
        return [(x + 1) * scale + offsetX, (y + 1) * scale + offsetY];
    }

    function drawPolygonOnCanvas(polygon, fillColor = 'rgba(0,128,255,0.3)', strokeColor = 'blue') {
        const coords = polygon.geometry.coordinates[0];
        ctx.beginPath();
        coords.forEach((coord, i) => {
            const [cx, cy] = toCanvasCoords(coord);
            if (i === 0) ctx.moveTo(cx, cy);
            else ctx.lineTo(cx, cy);
        });
        ctx.fillStyle = fillColor;
        ctx.fill();
        ctx.strokeStyle = strokeColor;
        ctx.stroke();
    }

    // --- Delay helper ---
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    // --- Draw main polygon ---
    drawPolygonOnCanvas(polygon, 'rgba(0,128,255,0.3)', 'blue');
    (async () => {
        for (let area of areasSorted) {
            const rectangle = makeRectangle(area.point1, area.point2);
            if (turf.booleanContains(polygon, rectangle)) {
                rectanglesInPolygon.push(area);
                drawPolygonOnCanvas(rectangle, 'rgba(255,128,0,0.3)', 'orange');
                await sleep(200); // 200ms delay
            }
        }
    })();
})