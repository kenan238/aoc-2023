const fs = require('fs') 
let input = fs.readFileSync('data.txt', 'utf8').split('\r\n').map(line => ({ dir: line.split(' ')[0], num: Number(line.split(' ')[1]), color: line.split(' ')[2] }))

// Shoelace algorithm
const calculateArea = (coords) => {
  let area = 0
  for (let i = 0; i < coords.length; i++) {
    const [x1, y1] = coords[i]
    const [x2, y2] = coords[(i + 1) % coords.length]
    area += x1 * y2 - x2 * y1
  }
  return Math.abs(area) / 2
}

const dirs = ['R', 'D', 'L', 'U']
const day18 = (part2) => {
  let corners = [[0, 0]]
  let last
  let p = 0 // perimeter
  input.forEach(line => {
    if (part2) {
      line.num = parseInt(line.color.slice(2, -2), 16)
      line.dir = dirs[line.color.slice(-2).slice(0, -1)]
    }

    last = corners[corners.length - 1]
    switch (line.dir) {
      case 'R':
        corners.push([last[0], last[1] + line.num])
        break
      case 'L':
        corners.push([last[0], last[1] - line.num])
        break
      case 'U':
        corners.push([last[0] - line.num, last[1]])
        break
      case 'D':
        corners.push([last[0] + line.num, last[1]])
        break
    }

    p += line.num
  })

  console.log((part2 ? 'Part 2' : 'Part 1'), calculateArea(corners) + (p / 2) + 1)
}

// part1
day18()
// part2
day18(true)