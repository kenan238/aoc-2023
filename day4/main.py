import parse
from dataclasses import dataclass

lines = []

with open('./data.txt', 'r') as f:
  lines = f.readlines()


@dataclass
class Card:
  nums1: list[int]
  nums2: list[int]
  identity: int
  
  @staticmethod
  def getCounts(cards):
    counts = {}
    for card in cards:
      if card.identity in counts: counts[card.identity] += 1
      else: counts[card.identity] = 1
    return counts

  def getMatches(self):
    matches = []
    for num in self.nums1:
      if num in self.nums2:
        matches.append(num)
    return matches

  def points(self):
    matches = self.getMatches()
    
    point = 0
    for i in range(len(matches)):
      if point == 0:
        point = 1
        continue
      point *= 2
    
    return point

cards = []
indexTable = {}
for line in lines:
  line = line.replace('\n', '')
  parsed = parse.parse("Card {}: {} | {}", line)
  parsed = [x.strip() for x in parsed]
  card = Card(identity=parsed[0], nums1=[int(x) for x in parsed[1].split(' ') if x != ''], nums2=[int(x) for x in parsed[2].split(' ') if x != ''])
  cards.append(card)
  indexTable[int(card.identity)] = len(cards) - 1

# Part 1
wins = 0
total = 0

for card in cards:
  total += card.points()
  wins += 1

print('Part 1', total)

# Part 2
for card in cards:
  matches = card.getMatches()
  for i in range(len(matches)):
    reference = cards[indexTable[int(card.identity) + i + 1]]
    cards.append(Card(nums1=reference.nums1, nums2=reference.nums2, identity=reference.identity))
    wins += 1

print('Part 2', wins)