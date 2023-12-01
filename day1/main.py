import re

data = ""

with open('./data.txt', 'r') as f:
    data = f.readlines()

def digitsOf(txt, faulty):
    pattern = r'\d+'

    if not faulty:
        nums = ['zero','one','two','three','four','five','six','seven','eight','nine','ten']
        pattern = r'(?=('
        for x in nums:
            pattern += x + '|'
        pattern += '\d))'

    # get digits from string
    digits = re.findall(pattern, txt)

    if not faulty:
        # convert
        for i in range(len(digits)):
            if digits[i] in nums:
                digits[i] = str(nums.index(digits[i]))
            else:
                digits[i] = digits[i]

    # expand all digits into actual digits 
    digits = [[*list(x)] for x in digits]
    # extract
    extracted = []
    for x in digits:
        for y in x:
            extracted.append(y)

    return extracted

def part1(txt):
    total = 0
    for line in data:
        line = line[:len(line)-1]
        digits = digitsOf(line, True)
        if len(digits) < 1:
            continue
        total += int(digits[0] + digits[-1])
    
    print('Part 1', total)

def part2(txt):
    total = 0
    for line in data:
        line = line[:len(line)-1]
        digits = digitsOf(line, False)
        if len(digits) < 1:
            continue
        total += int(digits[0] + digits[-1])
    
    print('Part 2', total)

part1(data)
part2(data)