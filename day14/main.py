in_data = []
with open('./data.txt') as f:
   line = f.readline()
   while line:
       in_data.append(list(line.strip('\n')))
       line = f.readline()

new_grid = [x[:] for x in in_data]

def calcLoad(grid):
  load = 0
  for i in range(len(grid)):
      load+=grid[i].count('O')*(len(grid)-i)
  return load

# rotates the whole map clockwise
def rotateClockwise(cur):
  rotate = []
  width = len(cur)
  for j in range(len(cur[0])):
    col = ['']*width
    for i in range(len(cur)):
      col[len(cur)-i-1] = cur[i][j]
    rotate.append(col)
  return rotate

def tiltUp(new_grid):
  for j in range(len(new_grid[0])):
    # swap all rocks to their floor space
    cur_empty = (0,0)
    for i in range(len(new_grid)):
      if new_grid[i][j] == '.':
        cur_empty = (i,j)
        break
    newEmpty = False
    for i in range(len(new_grid)):
      if i < cur_empty[0]:
        continue
      if new_grid[i][j] == '.' and newEmpty:
        newEmpty = False
        cur_empty = (i,j)
      if new_grid[i][j] == 'O' and not newEmpty:
        new_grid[cur_empty[0]][cur_empty[1]] = 'O'
        new_grid[i][j] = '.'
        cur_empty = (cur_empty[0]+1,j)
      if new_grid[i][j] == '#':
        newEmpty = True
  return new_grid

# Part 1
new_grid = tiltUp(new_grid)
print('Part 1', calcLoad(new_grid))

# Part 2
new_grid = [x[:] for x in in_data]
cycles = 1_000_000_000

states = dict()

for k in range(cycles):
  # run all cycles
  for i in range(4):
    new_grid = tiltUp(new_grid)
    new_grid = rotateClockwise(new_grid)
  
  # cache previous states to skim through them
  cur_state = ''.join(''.join(x) for x in new_grid)
  if cur_state in states:
    loop_size = k - states[cur_state]
    loop_start = states[cur_state]
    break
  else:
    states[cur_state] = k
# get the looping section
step = (cycles - (loop_start+1)) % loop_size

# re-repeat only the necessary steps
for m in range(step):
  for i in range(4):
    new_grid = tiltUp(new_grid)
    new_grid = rotateClockwise(new_grid)
    
print('Part 2', calcLoad(new_grid))