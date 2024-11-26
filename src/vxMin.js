const testing = (length = 30) => new Uint8ClampedArray(Array.from({length}, () => Math.floor(Math.random() * 255)))

// *********************
/**
 * 
 * @param {Uint8ClampedArray} arr 
 * @returns a Uint8ClampedArray that allows for expantion
*/
export function reduce(arr) {
    // we will probably recieve a stream or blob instead
    arr = testing(10) // ...

    // optionally * this is reusable
    // convert arr to base 2
    const convArr = arr.reduce((ret, v) => [...ret, ...tenTobase(v, 2, 8)], [])
    // convert to base 3
    const bse3 = transformUp({base: 2, arr: convArr})
    // const rev21 = transformDown({base: 3, arr: bse3.basePlusOne, rest: bse3.restBF})
    // console.log(JSON.stringify(convArr) === JSON.stringify(rev21.baseMinusOne), ": the reverse === the original")
    // let revArr = rev21.baseMinusOne.map((v, i) => ({v, i})).reduce((ret, {v, i}) => (i % 8) === 7 ? [...ret, baseTo10(convArr.slice(i - 7, i + 1), 2, 8)] : ret, [])
    // console.log({arr, revArr})

    // convert to base 4
    const bse4 = transformUp({base: 3, arr: bse3.basePlusOne})
    // const rev43 = transformDown({base: 4, arr: bse4.basePlusOne, rest: bse4.restBF})
    // console.log(JSON.stringify(bse3.basePlusOne) === JSON.stringify(rev43.baseMinusOne), ": the reverse === the original")
    // let revArr1 = rev43.baseMinusOne.map((v, i) => ({v, i})).reduce((ret, {v, i}) => (i % 4) === 3 ? [...ret, baseTo10(convArr.slice(i - 3, i + 1), 4, 8)] : ret, [])
    // console.log({original: bse3.basePlusOne, revArr1})

    console.log(bse4)

    return null
    /*///////
    // convert from base 3 arr to base 4 arr
    // maybe have transformUp return an array instead
    let obj2 = transformUp(3, itterateHandleBitFromByte)
    let restBF = obj2.restBF
    let base4 = obj2.nwBseArr
    const v2 = 8
    let pointer = 0
    const getValsFromArr = (n = 1) => {
        // slice update ret
        const out = base3.slice(pointer, pointer + n)
        pointer += n
        return out
    }
    for(let i = 0; i < v2; i++) {
        let obj = transformUp(3, getValsFromArr, restBF)
        restBF = obj.restBF
        base4 = [...base4, ...obj.nwBseArr]
    }

    //*** reverse b4 to b3
    const {original} = transformDown(4, base4, [])
    let rev2 = []
    console.log({base3, base3Rev: original}, 'is equail ?', JSON.stringify(base3) === JSON.stringify(original))
    //*** working ?? 

    // rem
    const test = (currentByteIndex * 8) + currentBitIndex - restBF.length
    console.log({arr, rev1, base3, base4, pointer, currentByteIndex}, `from ${test} base 2's to ${4 * (arr.length)} base 3's`, restBF)
    return null */
}

const transformDown = ({base, arr, rest= [], sml = 5, to = 4}) => {
    if(base < 3) return null
    // the amount of numbers we need to extract from sml + 1 
    const numberOfEntitiesInNMinus1 = (base ** to) - ((base - 1) ** sml)
    // set up variables
    let index = 0
    // returns n baseF numbers from arr
    const getBaseNumsFromArr = (n = 1) => {
        // lets just slice them out 
        const out = arr.slice(index, index + n)
        index += n
        return out
    }
    // a single transformation from higher to lower base
    const transformDownStep = () => {
        const arrBF = getBaseNumsFromArr(to)
        const decVal = baseTo10(arrBF, base)
        if(decVal < numberOfEntitiesInNMinus1) {
                // sml + 1 === original length 
                return tenTobase(decVal, base - 1, sml + 1)
        } else {
                // sml === original length
                return tenTobase(decVal - numberOfEntitiesInNMinus1, base - 1, sml)
        }
    }

    // get the base nums
    let baseMinusOne = []
    while(index < (arr.length - to)) baseMinusOne = [...baseMinusOne, ...transformDownStep()]
    let restBF = arr.slice(index)
    if(restBF.length >= to) {
        baseMinusOne = [...baseMinusOne, ...transformDownStep()]
        if(rest.length) {
            index += restBF.length
            baseMinusOne = [...baseMinusOne, ...rest]
        }
        restBF = arr.slice(index)
    }

    return {baseMinusOne, restBF}
}

/**
 * itterate over arr and convert base
 * @param {Number} base === baseF
 * @param {Array(Number)} arr an array of baseF
 * @param {Array(Number)} restBF should not exceed length of 2
 * @param {Number} sml (base ** sml) === number of values entirely swallowed by ((base + 1) ** to)
 * @param {Number} to could be sml - 1    : not sure this is 100% the case, though probably is
 * @returns obj = {nwBseArr, restBF}
 * note: sml and to can be generated from base
 */
const transformUp = ({base, arr, rest = [], sml = 5, to = 4}) => {
    if(base < 2) return null
    // the amount of numbers we need to extract from sml + 1 
    const numberOfEntitiesInNPlus1 = ((base + 1) ** to) - (base ** sml)
    // set up variables
    let index = 0
    // returns n baseF numbers from arr
    const getBaseNumsFromArr = (n = 1) => {
        // lets just slice them out 
        const out = arr.slice(index, index + n)
        index += n
        return out
    }
    // a single transformation from lower to higher base
    const transformUpStep = (restBF = []) => {
        const arrBF = [...restBF, ...getBaseNumsFromArr((sml + 1) - restBF.length)]
        let decVal = baseTo10(arrBF, base)
        if(decVal >= numberOfEntitiesInNPlus1) {
            // unset extra val from arr - since last value from arrBf is not required this itteration
            arrBF.pop()
            index --
            // update decVal
            decVal = baseTo10(arrBF, base) + numberOfEntitiesInNPlus1
        }
        return tenTobase(decVal, base + 1, to)
    }

    // get the base nums
    let basePlusOne = transformUpStep(rest)
    while(index < (arr.length - sml)) basePlusOne = [...basePlusOne, ...transformUpStep()]
    let restBF = arr.slice(index)
    if((restBF.length === sml && (baseTo10(restBF, base, sml) >= numberOfEntitiesInNPlus1)) || restBF.length > sml) {
        basePlusOne = [...basePlusOne, ...transformUpStep()]
        restBF = arr.slice(index)
    }
    return {basePlusOne, restBF}
}

const baseTo10 = (arr, base = 2, len = 2 << 50) => {
    let out = 0
    arr.forEach((v, i) => len > i ? out = (out * base) + v : null)
    return out
}

/**
 * 
 * @param {Number} val base 10
 * @param {Number} base desired base
 * @param {Number} len optional setting to set length of resulting array
 * @returns 
 */
const tenTobase = (val, base = 2, len = 100) => {
    if(len > 100 || val < 0) return null
    let out = []
    let locVal = val
    for(let i = 1; i <= len; i++) {
        out.push(locVal % base)
        locVal = Math.floor(locVal / base)
        if(len === 100 && !locVal)  break
    }
    return out.reverse()
}

// *********************

export const vxMin = (function() {
    /**
     * 
     * @constructor
     * @public
     * @param {Object} props 
     */
    function vxMinClass(arr) {
        this.currentByteIndex = -1
        this.currentByteValue = null
        this.currentBitIndex = 7;
        this.currentBitValue = null
        this.data = arr

        return this;
    }
    
    vxMinClass.prototype.hanldeGetBitFromByte = function() {
        // check the currentByteValue and set variables if need be
        if(this.currentBitIndex === 7) {
            this.currentByteIndex ++
            this.currentByteValue = this.data[this.currentByteIndex] // I could reverse data initially and pop this out ...
            this.currentBitIndex = -1;
        }
        // update bit variables
        this.currentBitIndex ++
        this.currentBitValue = getBitFromByte(this.currentByteValue, this.currentBitIndex)
    }

    const getBitFromByte = (byteVal, bitIndex) => (byteVal >> (7 - bitIndex)) % 2 // we will be counting bits from left to right

    vxMinClass.prototype.itterateHandleBitFromByte = function(n = 1) {
        let arr = []
        for(let i = 0; i < n; i++){
            this.hanldeGetBitFromByte()
            arr.push(this.currentBitValue)
        }
        return arr
    }

    /**************Public API****************/

    vxMinClass.prototype.info = function () {
        // for testing
        console.log(this)
    }

    return vxMinClass;
})()