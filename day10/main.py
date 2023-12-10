from collections import defaultdict
from queue import Queue

class Pos:
    def __init__(self, r, c):
        self.r = r
        self.c = c
    def __eq__(self, other):
        return (self.r, self.c) == (other.r, other.c)
    def __hash__(self):
        return hash((self.r, self.c))
    def __repr__(self):
        return '({}, {})'.format(self.r, self.c)

class Graph:
    def __init__(self):
        self.edges = defaultdict(set)
    def add_edge(self, u, v):
        self.edges[u].add(v)

g = Graph()
with open('data.txt', 'r') as f:
    for i, line in enumerate(f.readlines()):
        for j, char in enumerate(line.strip()):
            pos = Pos(i, j)
            if char == 'S':
                animal = pos
            elif char == '|':
                g.add_edge(pos, Pos(i-1, j))
                g.add_edge(pos, Pos(i+1, j))
            elif char == '-':
                g.add_edge(pos, Pos(i, j-1))
                g.add_edge(pos, Pos(i, j+1))
            elif char == 'L':
                g.add_edge(pos, Pos(i-1, j))
                g.add_edge(pos, Pos(i, j+1))
            elif char == 'J':
                g.add_edge(pos, Pos(i-1, j))
                g.add_edge(pos, Pos(i, j-1))
            elif char == '7':
                g.add_edge(pos, Pos(i, j-1))
                g.add_edge(pos, Pos(i+1, j))
            elif char == 'F':
                g.add_edge(pos, Pos(i, j+1))
                g.add_edge(pos, Pos(i+1, j))
        m = j+1
    n = i+1

for delta in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
    dr, dc, = delta
    nbr = Pos(animal.r + dr, animal.c + dc)
    if animal in g.edges[nbr]:
        g.add_edge(animal, nbr)

def bfs(start):
    dist = {start: 0}
    q = Queue()
    q.put(start)
    while not q.empty():
        current = q.get()
        for nbr in g.edges[current]:
            if nbr in dist:
                continue
            dist[nbr] = dist[current]+1
            q.put(nbr)
    return dist

# part 1
dist = bfs(animal)
print(max(dist.values()))

# part 2
def is_inside(pos, loop):
    crosses = 0
    for j in range(pos.c + 1, m+1):
        new_pos = Pos(pos.r, j)
        last_pos = Pos(pos.r, j-1)
        if new_pos in loop and last_pos in loop and new_pos in g.edges[last_pos]:
            continue
        if last_pos in loop:
            exited = last_pos
            edge_up = False
            edge_down = False
            for node in [entered, exited]:
                if Pos(node.r-1, node.c) in g.edges[node]:
                    edge_up = True
                if Pos(node.r+1, node.c) in g.edges[node]:
                    edge_down = True
            if edge_up and edge_down:
                crosses += 1
        if new_pos in loop:
            entered = new_pos
    return (crosses % 2) == 1

loop = set(dist.keys())
total = 0
for i in range(n):
    for j in range(m):
        pos = Pos(i, j)
        if pos in loop:
            continue
        total += is_inside(pos, loop)
print(total)