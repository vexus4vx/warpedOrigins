const sum = (arr) => arr.reduce((partialSum, a) => partialSum + a, 0)

// we will be counting bits from left to right
const getBitFromByte = (byteVal, bitIndex) => (byteVal >> (7 - bitIndex)) % 2

/**
 * removes the first bit from byteVal - assumes a number < 256 and > 0
 * @param {Number} byVal will be mutated to remove n bits
 * @param {Number} n 
 * @returns the first bit
 */
const getFirstBitInByte = (byVal, n = 7) => byVal - ((byVal >> n) << n)
