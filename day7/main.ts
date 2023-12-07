import { readFileStrSync } from "https://deno.land/std@0.51.0/fs/mod.ts";

const input = readFileStrSync('./data.txt', 'utf8').split('\r\n');

type HandType = 'unknown' | 'fiveKind' | 'fourKind' | 'fullHouse' | 'threeKind' | 'twoPair' | 'onePair' | 'highCard';
interface Hand {
  cards: string[];
  type: HandType;
  mostUsedChar: {};
  sortedChars: string[];
  bid: number;
  typeJoker: HandType;
  hasJoker: boolean;
}

function getType(hand: Hand): HandType {
  // is it a five kind?
  const allCharsSame = hand.cards.every(c => c === hand.cards[0]);
  if (allCharsSame)
    return 'fiveKind';
  
  // see what's the most used character
  // see how many times the most used char is used
  const mostUsedCharCount = hand.mostUsedChar[hand.sortedChars[0]];

  // four kind?
  if (mostUsedCharCount === 4)
    return 'fourKind';

  if (mostUsedCharCount === 3) {
    // either three of kind or full house
    if (hand.sortedChars.length === 2)
      return 'fullHouse';
    else
      return 'threeKind';
  }

  // two pair?
  if (mostUsedCharCount === 2 && hand.sortedChars.length === 3)
    return 'twoPair';

  // one pair?
  if (mostUsedCharCount === 2 && hand.sortedChars.length === 4)
    return 'onePair';
  
  return 'highCard';
}

function getTypeP2(hand: Hand): HandType {
  let copy = { ...hand };
  if (copy.hasJoker) {
    // replace ALL jokers with sorted chars
    copy.cards = copy.cards.map(c => c === 'J' ? hand.sortedChars[0] : c);
    copy = populateHandStats(copy);
  }

  return getType(copy);
}

function getStrength(hand: Hand): number {
  switch (hand.type) {
    case 'fiveKind':
      return 10;
    case 'fourKind':
      return 9;
    case 'fullHouse':
      return 8;
    case 'threeKind':
      return 7;
    case 'twoPair':
      return 6;
    case 'onePair':
      return 5;
    case 'highCard':
      return 4;
    default:
      return 0;
  }
}

function getStrengthJoker(hand: Hand): number {
  return getStrength({
    ...hand,
    type: hand.typeJoker
  })
}

function populateHandStats(hand: Hand): Hand {
  const mostUsedChar = {}
  hand.cards.forEach(chr => {
    if (mostUsedChar[chr])
      mostUsedChar[chr]++;
    else
      mostUsedChar[chr] = 1;
    return mostUsedChar;
  });

  // make a list of chars from most used to least
  const sortedChars = Object.keys(mostUsedChar).sort((a, b) => mostUsedChar[b] - mostUsedChar[a]);

  return {
    ...hand,
    mostUsedChar,
    sortedChars
  }
}

const hands: Hand[] = [];

for (let line of input) {
  const pair = line.split(' ');

  const chars = [...pair[0]];

  // @ts-ignore
  let hand: Hand = {
    cards: chars,
    type: 'unknown',
    typeJoker: 'unknown',
    hasJoker: pair[0].includes('J'),
    bid: parseInt(pair[1])
  };

  hand = populateHandStats(hand);

  hand.type = getType(hand);
  hand.typeJoker = getTypeP2(hand);
  hands.push(hand);
}

const rank = (a: Hand, b: Hand, faulty: boolean) => {
  const aStrength = !faulty && a.hasJoker ? getStrengthJoker(a) : getStrength(a);
  const bStrength = !faulty && b.hasJoker ? getStrengthJoker(b) : getStrength(b);

  if (aStrength !== bStrength)
    return aStrength - bStrength;

  // same strength, compare the cards
  let strengthTable = "23456789TJQKA";

  if (!faulty)
    strengthTable = "*23456789TQKA";

  for (let i = 0; i < a.cards.length; i++) {
    const aChar = a.cards[i];
    const bChar = b.cards[i];

    const theresJoker = (aChar !== 'J' && bChar !== 'J');
    if (aChar !== bChar && (!faulty ? theresJoker : true))
      return strengthTable.indexOf(aChar) - strengthTable.indexOf(bChar);
  }

  return 0;
}

// sort hands by strength
const rankedHands = hands.sort((a: Hand, b: Hand) => rank(a, b, true))

// get winnings (hand.bid * hand rank (idx))
let winnings = 0;

for (let i = 0; i < rankedHands.length; i++) {
  winnings += rankedHands[i].bid * (i + 1);
}

console.log('Part 1', winnings)

// sort hands by strength
const rankedHandsJokered = hands.sort((a: Hand, b: Hand) => rank(a, b, false))

// get winnings (hand.bid * hand rank (idx))
winnings = 0;

for (let i = 0; i < rankedHandsJokered.length; i++) {
  winnings += rankedHandsJokered[i].bid * (i + 1);
}

console.log('Part 2', winnings)