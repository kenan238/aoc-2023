with open("data.txt", "r") as file:
    grid = {}
    bricks_down = {}
    bricks_up = {}
    falling_bricks = {}
    bricks = []
    p1 = p2 = 0
    data = [[[*map(int, y.split(","))] for y in x.split("~")]
            for x in file.read().splitlines()]
    
    # make the bricks fall
    for brick in sorted(data, key=lambda x: min([x[0][2], x[1][2]])):
        x, y, z = [list(range(
            *((b := sorted([brick[0][a], brick[1][a]]))[0], b[1] + 1))) for a in range(3)]
        brick = set()
        while z[0] > 1 and not any((a, b, c - 1) in grid for a in x for b in y for c in z):
            z = [z[0] - 1] + z[:-1]
        bricks.append(brick := tuple(
            sorted({(a, b, c) for a in x for b in y for c in z})))
        bricks_down[brick] = set()
        minz = min(z[2] for z in brick)
        for x, y, z in brick:
            grid[x, y, z] = brick
            if z == minz and (x, y, z - 1) in grid:
                down_brick = grid[x, y, z - 1]
                bricks_down[brick].add(down_brick)
                bricks_up[down_brick] = bricks_up.get(
                    down_brick, set()) | {brick}
    for brick in bricks:
        if not (up := bricks_up.get(brick, [])) or all([len(bricks_down.get(x, [])) > 1 for x in up]):
            p1 += 1
        queue = [brick]
        falling_bricks = {brick}
        while queue:
            current = queue.pop()
            for nxt in bricks_up.get(current, set()):
                if not bricks_down[nxt] - falling_bricks:
                    falling_bricks.add(nxt)
                    queue.append(nxt)
        p2 += len(falling_bricks - {brick})
    print('Parts', p1, p2)
