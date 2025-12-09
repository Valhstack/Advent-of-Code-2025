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

// ----------------- Helper functions -----------------
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

function rectangleFullyInsidePolygon(p1, p2, polygon) {
    const x1 = parseCoord(p1.X);
    const y1 = parseCoord(p1.Y);
    const x2 = parseCoord(p2.X);
    const y2 = parseCoord(p2.Y);

    const rectCoords = [
        [x1, y1],
        [x2, y1],
        [x2, y2],
        [x1, y2],
        [x1, y1] // close rectangle
    ];

    const rectangle = turf.polygon([rectCoords]);

    // 1) All rectangle corners inside or on polygon edges
    const corners = rectCoords.slice(0, 4).map(c => turf.point(c));
    const allInside = corners.every(pt => turf.booleanPointInPolygon(pt, polygon, { ignoreBoundary: false }));
    if (!allInside) return false;

    // 2) Check rectangle edges against polygon edges
    const rectEdges = [
        [rectCoords[0], rectCoords[1]],
        [rectCoords[1], rectCoords[2]],
        [rectCoords[2], rectCoords[3]],
        [rectCoords[3], rectCoords[0]],
    ];

    const polyCoords = polygon.geometry.coordinates[0];
    const polyEdges = [];
    for (let i = 0; i < polyCoords.length - 1; i++) {
        polyEdges.push([polyCoords[i], polyCoords[i + 1]]);
    }

    for (const [rStart, rEnd] of rectEdges) {
        const rectLine = turf.lineString([rStart, rEnd]);
        for (const [pStart, pEnd] of polyEdges) {
            const polyLine = turf.lineString([pStart, pEnd]);
            const intersects = turf.lineIntersect(rectLine, polyLine);
            if (intersects.features.length > 0) {
                // allow intersection only at rectangle corners or polygon vertices
                const valid = intersects.features.every(f => {
                    const [x, y] = f.geometry.coordinates;
                    const onRectCorner = rectCoords.slice(0, 4).some(c => c[0] === x && c[1] === y);
                    const onPolyVertex = polyCoords.some(c => c[0] === x && c[1] === y);
                    return onRectCorner || onPolyVertex;
                });
                if (!valid) return false;
            }
        }
    }

    return true;
}

// draw.js
async function drawCanvas(pointsSorted, areasSorted) {
    if (!pointsSorted || pointsSorted.length < 3 || !areasSorted) return;

    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");

    // scaling
    const xs = pointsSorted.map(p => parseFloat(p.X));
    const ys = pointsSorted.map(p => parseFloat(p.Y));
    const minX = Math.min(...xs), maxX = Math.max(...xs);
    const minY = Math.min(...ys), maxY = Math.max(...ys);
    const padding = 50;
    const scaleX = (canvas.width - 2 * padding) / (maxX - minX || 1);
    const scaleY = (canvas.height - 2 * padding) / (maxY - minY || 1);
    const scale = Math.min(scaleX, scaleY);

    function mapCoord([x, y]) {
        const cx = (x - minX) * scale + padding;
        const cy = canvas.height - ((y - minY) * scale + padding);
        return [cx, cy];
    }

    function drawPolygon(polygon, fill = 'rgba(0,128,255,0.3)', stroke = 'blue') {
        const coords = polygon.geometry.coordinates[0];
        ctx.beginPath();
        coords.forEach((c, i) => {
            const [cx, cy] = mapCoord(c);
            if (i === 0) ctx.moveTo(cx, cy);
            else ctx.lineTo(cx, cy);
        });
        ctx.fillStyle = fill;
        //ctx.fill();
        ctx.strokeStyle = stroke;
        ctx.stroke();
    }

    function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

    // Draw main polygon
    const mainCoords = closeRing(pointsSorted.map(p => [parseFloat(p.X), parseFloat(p.Y)]));
    const polygon = turf.polygon([mainCoords]);
    drawPolygon(polygon, 'rgba(0,128,255,0.3)', 'blue');

    // Draw rectangles
    // Draw rectangles
    for (let area of areasSorted) {
        const rect = makeRectangle(area.point1, area.point2);

        // Use robust rectangle check
        if (rectangleFullyInsidePolygon(area.point1, area.point2, polygon)) {
            drawPolygon(rect, 'rgba(255,128,0,0.3)', 'orange');
            await sleep(700);
        }
    }
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
    let areas = [];

    for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
            let area = (Math.abs(points[i].X - points[j].X) + 1) * (Math.abs(points[i].Y - points[j].Y) + 1);
            areas.push(new Area(area, points[i], points[j]));
        }
    }

    if (!points || points.length < 3) {
        throw new Error("pointsSorted is missing or has fewer than 3 points");
    }

    // Build polygon
    const mainCoords = closeRing(points.map(p => [parseCoord(p.X), parseCoord(p.Y)]));
    const polygon = turf.polygon([mainCoords]);

    let rectanglesInPolygon = [];

    const areasSorted = areas.sort((a, b) => b.area - a.area);
    console.log("All areas sorted: ", areasSorted);

    // --- LOOP FOR RECTANGLES ---
    for (let area of areasSorted) {
        if (rectangleFullyInsidePolygon(area.point1, area.point2, polygon)) {
            rectanglesInPolygon.push(area);
        }
    }

    console.log("Rectangles fully inside polygon:", rectanglesInPolygon);

    console.log("All rectangles in polygon: ", rectanglesInPolygon);

    console.log("Biggest area now: ", rectanglesInPolygon[0], "; point 1 index: ");

    drawCanvas(points, areasSorted);
})