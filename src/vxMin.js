const testing = () => new Uint8ClampedArray(Array.from({length: 30}, () => Math.floor(Math.random() * 255)))

/**
 * 
 * @param {Uint8ClampedArray} arr 
 * @returns a Uint8ClampedArray that allows for expantion
*/
export function reduce(arr) {
    // we will probably recieve a stream or blob instead
    arr = testing() // ...

    // set up variables
    let currentByteIndex = -1;
    let currentByteValue = null;
    let currentBitIndex = 7;
    let currentBitValue = null;
    const hanldeGetBitFromByte = () => {
        // check the currentByteValue and set variables if need be
        if(currentBitIndex === 7) {
            currentByteIndex ++
            currentByteValue = arr[currentByteIndex]
            currentBitIndex = -1;
        }
        // update bit variables
        currentBitIndex ++
        currentBitValue = getBitFromByte(currentByteValue, currentBitIndex)
    }
    const itterateHandleBitFromByte = (n) => {
        let arr = []
        for(let i = 0; i < n; i++){
            hanldeGetBitFromByte()
            arr.push(currentBitValue)
        }
        return arr
    }
   
    // we need the initial values
        // use 3b to get 2 b3 nums |
        // simply use 2b and assume b3 |
        // use 3b but assume b3
    let values = itterateHandleBitFromByte(3);
    let initialB3 = b3FromB2(values, true)

    // given initialB3 undo the lossy reduction and ask every time you require a clue
    const undoLossyRed = () => {
        // pass require clue as a funct so you can abstract this and perfectly undo it - which ironically would probably do nearly all the work for 'expand' function
        // this is like a logic problem whith many nuaunces
        // also like broken simultanious equations where we can only make out so many ...
        // and we always have a + b = known value
    }

    console.log({initialB3, values, currentBitIndex, currentByteIndex, currentByteValue, arr})
    return null
}

// we will be counting bits from left to right
const getBitFromByte = (byteVal, bitIndex) => (byteVal >> (7 - bitIndex)) % 2

const baseTo10 = (arr, base = 2) => {
    let out = 0
    arr.forEach((v, i) => out = (out * base) + v)
    return out
}

// perfectly reversed by getB2FromB3 if length of b3 === 3
const b3FromB2 = (b2, setup) => {
    let b3 = []

    b2.forEach((v, i) => {
        if(i < b2.length - 1) b3.push(v + b2[i + 1])
    })
    return setup ? [...b3, b2[0] + b2[b2.length - 1]] : b3
}

// perfectly reversed by b3FromB2 if setup === true
const getB2FromB3 = (b3) => {
    if(b3.length !== 3) return null
    let b2 = []

    b3.forEach((v, i) => {
        // how do I auto generate the simultanious equations ????????????
        b2.push( i === 0 ? 
            (b3[0] - b3[1] + b3[2]) / 2 : i === 1 ? 
            b3[0] - b2[0] : 
            b3[2] - b2[0]
        )
    })
    return b2
}


/**
 * the reverse of the 'reduce' function
 * @param {Uint8ClampedArray} arr 
 * @returns a Uint8ClampedArray that allows for reduction
 */
export function expand(arr) {
    return null
}