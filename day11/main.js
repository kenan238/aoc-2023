const fs = require("fs");
const data = fs
  .readFileSync("./data.txt")
  .toString()
  .split("\r\n")
  .map((x) => [...x]);

const getStepsOfPathFrom = (pos1, pos2, ec, er, expans) => {
  return Math.abs(pos1[0] - pos2[0]) + Math.abs(pos1[1] - pos2[1]) + (ec + er) * (expans - 1);
};

// print as string
const print = () => {
  console.log(data.map((x) => x.join("")).join("\n"));
};

// expand();
print();

let steps = [];
// get all locations of #
const locations = [];
const rows = new Set();
const cols = new Set();
const h = data.length;
const w = data[0].length;
for (let y = 0; y < h; ++y) {
  for (let x = 0; x < w; ++x) {
    if (data[y][x] === '#') {
      locations.push([x, y])
      rows.add(y)
      cols.add(x)
    }
  }
}

const emptyCols = new Array(w).fill(0);
const emptyRows = new Array(h).fill(0);
for (let x = 0; x < w; ++x) 
  emptyCols[x] = emptyCols.at(x - 1) + (cols.has(x) ? 0 : 1)
for (let y = 0; y < h; ++y) 
  emptyRows[y] = emptyRows.at(y - 1) + (rows.has(y) ? 0 : 1)

// loop through all pairs

const solve = (expans) => {
  const n = locations.length;
  const distances = new Array(n * n).fill(0)

  for (let i = 0; i < locations.length; i++) {
    let location = locations[i]

    for (let j = i + 1; j < locations.length; j++) {
      let location2 = locations[j];
      
      const eCols = Math.abs(emptyCols[location[0]] - emptyCols[location2[0]])
      const eRows = Math.abs(emptyRows[location[1]] - emptyRows[location2[1]])

      // get the steps from location to location2
      let steps = getStepsOfPathFrom(location, location2, eCols, eRows, expans);

      distances[i + j * n] = steps;
    }
  }

  return distances;
}

console.log('Part 1', solve(2).reduce((a, b) => a + b, 0));
console.log('Part 2', solve(1000000).reduce((a, b) => a + b, 0));
