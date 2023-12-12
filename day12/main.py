from dataclasses import dataclass
from functools import cache

@dataclass
class Record:
  sizes: list[int]
  base: list[str]

records = []

@cache
def calculate_arrangements(pattern: str, counts: tuple[int]) -> int:
    if not pattern:
        return len(counts) == 0
    if not counts:
        return "#" not in pattern
    result = 0
    if pattern[0] in ".?":
        result += calculate_arrangements(pattern[1:], counts)
    if (
        pattern[0] in "#?"
        and counts[0] <= len(pattern)
        and "." not in pattern[: counts[0]]
        and (counts[0] == len(pattern) or pattern[counts[0]] != "#")
    ):
        result += calculate_arrangements(pattern[counts[0] + 1 :], counts[1:])

    return result

total, total2 = 0, 0

with open('./data.txt', 'r') as f:
  lines = f.readlines()
  for line in lines:
    splitted = line.split(" ")
    sizes = tuple(int(x) for x in splitted[1].split(","))
    record = Record(sizes=sizes, base=splitted[0])
    total += calculate_arrangements(record.base, record.sizes)
    total2 += calculate_arrangements("?".join([record.base] * 5), record.sizes * 5)

print('Part 1', total)
print('Part 2', total2)