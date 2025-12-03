let dialNumbers = [];
let dial = 50, password = 0, dialValue, temp = 50;

for (let i = 0; i < 100; i++) {
    dialNumbers.push(i);
}

async function fetchInput() {
    return await (await fetch("input.txt")).text();
}

fetchInput().then(input => {
    // main logic here

    let regex = /[A-Za-z]\d{1,2}/g;

    let matches = input.match(regex);

    console.log(matches);

    for (let match of matches) {
        if (match.includes("R")) {
            dialValue = match.replace("R", "");
            temp += Number(dialValue);

            if (temp > 99) {
                let temp1 = 100 - temp;
                if (temp1 < 0) temp1 *= -1;

                dial = temp1;
            }
            else {
                dial += Number(dialValue);
            }

            if (dial === 0) password++;

            temp = dial;
            console.log(dial);
        }
        else {
            dialValue = match.replace("L", "");
            temp -= Number(dialValue);

            if (temp < 0) {
                let temp1 = (0 - dial) * -1;
                let temp2 = dialValue - temp1 - 1;

                dial -= temp1;
                dial = 99 - temp2;
            }
            else {
                dial -= Number(dialValue);
            }

            if (dial === 0) password++;

            temp = dial;

            console.log(dial);
        }
    }

    console.log("Password: ",password);
})
