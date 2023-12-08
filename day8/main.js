const fs = require('fs');

const data = fs.readFileSync('./data.txt').toString().split('\r\n');
let directions;
let network = {};

for (let line of data) {
  if (line.trim() === '')
    continue;
  if (!line.includes('=')) {
    directions = line;
    continue;
  }

  let splitted = line.trim().split('=');
  let name = splitted[0].trim();
  let refs = splitted[1].replace('(', '').replace(')', '').split(', ').map(x => x.trim());

  network[name] = refs;
}

(function() {
  let ind = 0;
  let currentNode = 'AAA';
  while (currentNode !== 'ZZZ') {
    let chr = directions[ind % directions.length]
    if (chr === 'R') {
      currentNode = network[currentNode][1];
    }
    else if (chr === 'L') {
      currentNode = network[currentNode][0];
    }
    ind++;
  }

  console.log('Part 1', ind)
})();

// Part 2

let chr = directions[0]
let ind = 0;
let beginNodes = Object.keys(network).filter(x => x[2] == 'A')

function traverseDirection(node) {
  let count = 0;
  let currentNode = node;
  while (currentNode[2] !== 'Z') {
    let chr = directions[ind % directions.length]
    if (chr === 'R') {
      currentNode = network[currentNode][1];
    }
    else if (chr === 'L') {
      currentNode = network[currentNode][0];
    }
    ind++;
    count++;
  }

  return count;
}

function gcd(a, b) {
  return !b ? a : gcd(b, a % b);
}

// get the LCM of an array wiht more than 2 elements
function lcm(arr) {
  let ans = arr[0];
  for (let i = 1; i < arr.length; i++) {
    ans = (arr[i] * ans) / gcd(arr[i], ans);
  }
  return ans;
}

let counts = [];
for (let node of beginNodes) {
  counts.push(traverseDirection(node))
}

console.log('Part 2', lcm(counts))

