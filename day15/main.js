const { readFileSync } = require('fs');

const data = readFileSync("./data.txt").toString().split(",");

function hash(input) {
  let current = 0;
  for (let i = 0; i < input.length; i++) {
    let ascii = input.charCodeAt(i);
    current += ascii;
    current *= 17;
    current %= 256;
  }

  return current;
}

// Part 1
const hashSum = data => data.reduce((acc, v) => acc + hash(v), 0)

console.log('Part 1', hashSum(data));

// Part 2

// Apply steps
const boxNums = Array(256).fill(0).map((x, i) => i);
const boxes = boxNums.reduce((acc, v) => {
  return { ...acc, [v]: [] };
}, {});

for (const step of data) {
  const splitted = step.split(/\-|\=/g);
  const op = step.match(/\-|\=/g)[0];
  const label = splitted[0];
  const box = hash(label);

  switch (op) {
    case '-':
      boxes[box] = boxes[box].filter(x => x.label !== label);
      break;
    case '=':
      const hasLabel = boxes[box].some(x => x.label === label);
      if (hasLabel) {
        boxes[box].map(x => {
          if (x.label !== label) return x;

          x.focal = parseInt(splitted[1]);
          return x;
        })
        break;
      }

      boxes[box].push({
        label: label,
        focal: parseInt(splitted[1])
      })
      break;
  }
}

// Get focusing power of all lenses

let focusingPower = 0;
for (const box of Object.keys(boxes)) {
  const lenses = boxes[box]

  for (let i = 0; i < lenses.length; i++) {
    const lens = lenses[i];

    let boxNum = parseInt(box);
    let power = (boxNum + 1) * (i + 1) * lens.focal;

    focusingPower += power;
  }
}

console.log('Part 2', focusingPower);