with open('data.txt','r') as f:
    lines = f.read().split('\n')

digits = []

digit_map = {
    'one': 1,
    'two': 2,
    'three': 3,
    'four': 4,
    'five': 5,
    'six': 6,
    'seven': 7,
    'eight': 8,
    'nine': 9
}

def replace(line):
    substrings = [line[i:j+1] for i in range(len(line)) for j in range(i,len(line))]
    substrings = [s for s in substrings if s in digit_map.keys()]
    if len(substrings) != 0:
        line = line.replace(substrings[-1],f'{digit_map[substrings[-1]]}')
        line = line.replace(substrings[0],f'{digit_map[substrings[0]]}')
    return line

level2 = True

for line in lines:

    if level2:
        line = replace(line)
    
    start = 0
    end = len(line)-1
    first, second = None, None

    while first is None or second is None:
        if line[start].isdigit() and first is None:
            first = int(line[start])
        if line[end].isdigit() and second is None:
            second = int(line[end])

        start += 1
        end -= 1

    digits.append(first*10+second)

print(sum(digits))