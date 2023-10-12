/**
 * 
 * @param {Array <Number>} arr 
 * @returns 
 */
export const CalculateSum = (arr) => {
    return arr.reduce((tot, cur) => {
        return tot + cur;
    }, 0);
}