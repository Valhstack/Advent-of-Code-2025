async function fetchInput() {
    return await (await fetch("input.txt")).text();
}

async function fetchLines() {
    const response = await fetch("input.txt");
    const text = await response.text();
    const lines = text.split(/\r?\n/);

    return lines;
}

fetchLines().then(lines => {
    console.log("Initial input: ", lines, "Total length: ", lines.length, "One row length: ", lines[0].length);

    let lights = [], buttons = [], joltages = [];

    /*for (let line of lines) {
        lights.push(line.match(/\[(.*?)\]/g));
    }*/

    for (let line of lines) {
        joltages.push(line.match(/\{(.*?)\}/g))
    }

    joltages = joltages.map(l => String(l ?? "").replace("{", "").replace("}", "").split(","));

    console.log("Joltage: ", joltages);

    //lights = lights.map(l => String(l ?? "").replace("[", "").replace("]", "").split(""));

    for (let line of lines) {
        buttons.push(line.match(/\((.*?)\)/g))
    }

    let buttonsParsed = [];

    for (let button of buttons) {
        let newArr = [];
        for (let ch of button) {
            let newArr2 = [];
            for (let i = 0; i < ch.length; i++) {
                if (ch[i] !== "(" && ch[i] !== ")" && ch[i] !== ",") {
                    newArr2.push(ch[i]);
                }
            }

            newArr.push(newArr2);
        }

        buttonsParsed.push(newArr);
    }

    //console.log("Lights: ", lights, "; buttons to push: ", buttons);

    console.log("Buttons parsed: ", buttonsParsed);

    // For PART 1
    /*let lightBitMask = [];

    for (let light of lights) {
        let bitMask = "";

        for (let i = 0; i < light.length; i++) {
            if (light[i] === "#") {
                bitMask += "1";
            }
            else {
                bitMask += "0";
            }
        }

        lightBitMask.push(bitMask);
    }

    console.log("Lights bitmask: ", lightBitMask);*/

    // For PART 1

    /*let buttonsBitMask = [];

    for (let row = 0; row < buttonsParsed.length; row++) {

        let rowButtons = buttonsParsed[row];     // buttons for this row
        let numLights = lights[row].length;      // number of lights in this row

        let rowMasks = [];

        for (let button of rowButtons) {
            let mask = "";
            for (let i = 0; i < numLights; i++) {
                mask += button.includes(i.toString()) ? "1" : "0";
            }
            rowMasks.push(mask);
        }

        buttonsBitMask.push(rowMasks);
    }

    console.log("Buttons bitmask: ", buttonsBitMask)*/

    let buttonsBitMask = [];

    for (let row = 0; row < buttonsParsed.length; row++) {

        let rowButtons = buttonsParsed[row];     // buttons for this row
        let numJoltages = joltages[row].length;      // number of lights in this row

        let rowMasks = [];

        for (let button of rowButtons) {
            let mask = [];
            for (let i = 0; i < numJoltages; i++) {
                mask.push(button.includes(i.toString()) ? "1" : "0");
            }
            rowMasks.push(mask);
        }

        buttonsBitMask.push(rowMasks);
    }

    console.log("Buttons bitmask: ", buttonsBitMask);

    let initialState = [];
    let allPaths = [];

    // Build initialState as array of zeros for each row
    for (let i = 0; i < joltages.length; i++) {
        let newRow = [];
        for (let j = 0; j < joltages[i].length; j++) {
            newRow.push(0);
        }
        initialState.push(newRow);
    }

    console.log("Initial states:", initialState);

    for (let k = 0; k < joltages.length; k++) {
        let targetArray = joltages[k];
        let targetID = targetArray.join(",");

        let startArray = initialState[k];
        let startID = startArray.join(",");

        let queue = [];
        queue.push(startArray);

        let visited = new Set();
        visited.add(startID);

        let parent = {};  // parent[stateID] = previous stateID
        let action = {};  // action[stateID] = buttonIndex used

        let found = false;
        let finalID = null;

        while (queue.length !== 0) {
            let stateArray = queue.shift();
            if (!Array.isArray(stateArray)) {
                console.error("Queue contained non-array for row", k, "item:", stateArray);
                break;
            }
            let stateID = stateArray.join(",");

            if (stateID === targetID) {
                found = true;
                finalID = stateID;
                break;
            }

            // guard: ensure buttons exist for this row
            if (!buttonsBitMask || !buttonsBitMask[k]) {
                console.error("buttonsBitMask or buttonsBitMask[k] missing for row", k, buttonsBitMask);
                break;
            }

            for (let i = 0; i < buttonsBitMask[k].length; i++) {
                let buttonMask = buttonsBitMask[k][i];

                // guard: buttonMask must be an array of numbers of same length as stateArray
                if (!Array.isArray(buttonMask)) {
                    console.error("buttonMask is not an array at row", k, "index", i, buttonMask);
                    continue; // skip it so BFS continues
                }
                if (buttonMask.length !== stateArray.length) {
                    console.error("buttonMask length mismatch at row", k, "index", i,
                        "buttonMask.length=", buttonMask.length,
                        "stateArray.length=", stateArray.length);
                    continue;
                }

                // compute next
                let skipState = false;
                let nextArray = new Array(stateArray.length);

                for (let j = 0; j < buttonMask.length; j++) {
                    let a = Number(stateArray[j]) || 0;
                    let b = Number(buttonMask[j]) || 0;

                    let value = a + b;

                    // Prune if value exceeds target
                    if (value > targetArray[j]) {
                        skipState = true;
                        break;  // we stop building this nextArray entirely
                    }

                    nextArray[j] = value;
                }

                if (skipState) continue;  // skip this button result

                let nextID = nextArray.join(",");

                if (!visited.has(nextID)) {
                    visited.add(nextID);
                    parent[nextID] = stateID;
                    action[nextID] = i;
                    queue.push(nextArray);
                }
            }
        }

        // PATH RECONSTRUCTION FOR ROW k
        let path = [];

        if (found) {
            let curr = finalID;

            while (curr !== startID) {
                let buttonUsed = action[curr];
                path.unshift(buttonUsed);
                curr = parent[curr];
            }
        }

        allPaths.push(path);
    }

    console.log("All paths:", allPaths);

    // For PART 1

    /*let initialState = parseInt("0000", 2);

    let allPaths = [];

    for (let k = 0; k < lightBitMask.length; k++) {
        let targetState = parseInt(lightBitMask[k], 2);
        let buttonsSet = buttonsBitMask[k].map(b => parseInt(b, 2));

        let queue = [];
        let visited = new Set();
        visited.add(initialState);

        let parent = {};
        let action = {};

        queue.push(initialState);

        let found = false;
        let finalState = null;

        while (queue.length !== 0) {

            let state = queue.shift();

            if (state === targetState) {
                found = true;
                finalState = state;
                break;
            }

            for (let i = 0; i < buttonsSet.length; i++) {

                let nextState = state ^ buttonsSet[i];   // XOR toggle

                if (!visited.has(nextState)) {
                    visited.add(nextState);

                    parent[nextState] = state;   // record how we got here
                    action[nextState] = i;       // record which button

                    queue.push(nextState);
                }
            }
        }

        let path = [];

        if (found) {
            let curr = finalState;

            while (curr !== initialState) {
                path.unshift(action[curr]);    // prepend button index
                curr = parent[curr];
            }
        }

        allPaths.push(path);

        console.log("Path:", path);
    }

    console.log("All paths: ", allPaths);*/

    let result = 0;

    for (let path of allPaths) {
        result += path.length;
    }

    console.log("Result: ", result);

    // For the second part pretty much the same approach is needed, BUT now we do not simply change the state XOR -> we need to incrementally increase initial values by one every time button is pressed
    // Target state is now array of values and we got to convert existing buttonsBitMask from array of strings of type "0010" to array of separate values [0, 0, 1, 0]
})