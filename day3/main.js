const fs = require('fs');

const data = fs.readFileSync('./data.txt');
const lines = data.toString().split('\n');
const grid = lines.map(x => [...x.toString()]);

const gridGet = (x, y) => grid[y] == undefined ? '.' : grid[y][x];

const gridIsSymbol = (x, y) => {
  const symbol = gridGet(x, y);
  return symbol !== '.' && !isNaN(symbol);
}

const gridGetNeighborsOfNumber = (x, y, numLen) => {
  const neighbors = [];
  neighbors.push([-1, 0]); // left
  neighbors.push([numLen, 0]); // right

  for (let i = 0; i <= numLen; i++) {
    neighbors.push([i, -1]); // up
    neighbors.push([i, 1]); // down
  }

  // diagonal
  neighbors.push([-1, -1]);
  neighbors.push([-1, 1]);
  neighbors.push([numLen, -1]);
  neighbors.push([numLen, 1]);

  return neighbors;
}

const gridCoordListToChars = (coords) => coords.map(x => [gridGet(...x), x]).filter(x => x[0] != '\r' && x[0] != undefined);

const combineCoords = (coords, actual) => {
  const combined = [];
  for (let i = 0; i < coords.length; i ++) {
    const coord = coords[i];
    combined.push([coord[0] + actual[0], coord[1] + actual[1]]);
  }

  return combined;
}

const gridGetNumber = (number) => {
  // format is [x, y, length]
  let num = '';
  for (let i = 0; i < number[2]; i++) {
    num += gridGet(number[0] + i, number[1]);
  }
  return parseInt(num);
}

const gridAllNumbers = () => {
  // get all the numbers's coordinates in the grid and their length
  const numbers = [];

  for (let y = 0; y < grid.length; y++) {
    const row = grid[y];
    const numbersInRow = [];
    for (let x = 0; x < row.length; x++) {
      const symbol = row[x];
      if (symbol !== '.' && !isNaN(symbol) && symbol !== '\r') {
        // format is [x, y, length, combinedLength]
        numbersInRow.push([x, y, 1, 1]);
      }
      if (symbol === '.' && numbersInRow[numbersInRow.length - 1] != '.') {
        numbersInRow.push('.');
      }
    }

    // merge elements that are 1 unit off in the x axis
    for (let i = 0; i < numbersInRow.length; i++) {
      // combine with past coord
      const coord = numbersInRow[i];

      if (coord === '.' && i > 0) {
        numbersInRow[i - 1][3] = 0;
      }

      const pastCoord = numbersInRow[i - 1];
      if (pastCoord !== undefined && coord[0] - pastCoord[0] === pastCoord[3]) {
        numbersInRow[i - 1] = [pastCoord[0], coord[1], coord[2] + pastCoord[2], coord[3] + pastCoord[3]];
        numbersInRow.splice(i, 1);
        i--;
      }
    }

    numbers.push(...numbersInRow);
  }

  return numbers.filter(x => x != '.');
}

const numberCoords = gridAllNumbers();
let partSum = 0;
let charIdentities = {};

for (const num of numberCoords) {
  const number = gridGetNumber(num);
  // get neighbors
  const neighbors = gridGetNeighborsOfNumber(0, 0, num[2]);
  const correctNeighbors = combineCoords(neighbors, [num[0], num[1]])
  const neighborChars = gridCoordListToChars(correctNeighbors);

  // a number is a part number if their neighborChars array contains something other than dot and number
  const isPartNumber = neighborChars.some(x => x[0] !== '.' && isNaN(x[0]));
  
  for (let x of neighborChars) {
    let key = x[1].toString();
    if (charIdentities[key] === undefined) charIdentities[key] = [];
    charIdentities[key].push(num);
  }

  if (isPartNumber) partSum += number;
}

console.log('Part 1', partSum)

partSum = 0;

// Part 2

for (let coord of Object.keys(charIdentities)) {
  const numsAssigned = [...new Set(charIdentities[coord])];
  const actualCoord = coord.split(",").map(x => parseInt(x));
  const char = gridGet(...actualCoord)

  if (numsAssigned.length == 2 && char == '*') {
    let num1 = gridGetNumber(numsAssigned[0])
    let num2 = gridGetNumber(numsAssigned[1])
    partSum += num1 * num2;
  }
}

console.log('Part 2', partSum)