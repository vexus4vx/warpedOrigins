const dataSet2 = [
    [18, 22, 28, 34, 41, 42, 2],
    [5, 11, 18, 33, 37, 39, 2],
    [4, 9, 11, 14, 16, 17, 37],
    [1, 11, 19, 23, 24, 27, 17],
    [3, 4, 6, 7, 20, 23, 22],
    [1, 4, 11, 14, 21, 25, 13],
    [13, 14, 23, 26, 31, 34, 29],
    [14, 22, 25, 31, 34, 41, 4],
    [4, 6, 12, 24, 34, 35, 17],
    [6, 11, 22, 24, 33, 42, 39],
    [1, 16, 19, 35, 36, 37, 29],
    [7, 24, 31, 34, 35, 36, 20],
    [3, 8, 10, 31, 36, 39, 2],
    [7, 10, 21, 22, 24, 25, 17],
    [4, 11, 15, 17, 21, 41, 16],
    [2, 9, 10, 17, 27, 39, 11],
    [5, 17, 25, 31, 37, 40, 13],
    [6, 12, 23, 30, 34, 35, 5],
    [4, 5, 10, 13, 33, 36, 12],
    [1, 2, 4, 10, 21, 35, 14],
    [3, 5, 11, 27, 31, 37, 1],
    [16, 19, 25, 31, 32, 41, 30],
    [2, 3, 5, 6, 14, 34, 24],
    [3, 8, 12, 31, 33, 35, 22],
    [21, 24, 30, 31, 33, 42, 34],
    [12, 19, 28, 29, 35, 41, 31],
    [10, 19, 30, 32, 35, 40, 39],
    [5, 20, 27, 28, 29, 42, 40],
    [10, 15, 21, 27, 39, 42, 25],
    [4, 10, 17, 21, 29, 37, 9],
    [5, 7, 11, 17, 19, 34, 4],
    [16, 18, 20, 31, 33, 35, 38],
    [8, 14, 16, 28, 31, 33, 12],
    [7, 17, 19, 23, 25, 29, 1],
    [1, 12, 27, 30, 33, 36, 17],
    [19, 20, 24, 28, 29, 30, 15],
    [6, 11, 18, 29, 30, 31, 37],
    [2, 8, 11, 15, 26, 28, 38],
    [1, 2, 4, 18, 19, 21, 10],
    [18, 20, 22, 23, 27, 33, 19],
    [3, 7, 29, 30, 31, 39, 38],
    [4, 7, 10, 12, 18, 33, 19],
    [8, 9, 13, 16, 27, 30, 28],
    [11, 17, 18, 24, 26, 38, 16],
    [17, 20, 23, 27, 28, 36, 15],
    [10, 16, 17, 20, 24, 30, 15],
    [2, 7, 12, 18, 23, 32, 15],
    [3, 4, 5, 8, 24, 38, 13],
    [2, 13, 18, 29, 30, 34, 23],
    [21, 26, 28, 33, 34, 35, 18],
    [2, 9, 17, 22, 26, 29, 21],
    [7, 13, 15, 23, 25, 30, 17],
    [7, 13, 16, 19, 38, 39, 32],
    [8, 15, 16, 19, 24, 35, 38],
    [5, 8, 16, 21, 27, 32, 19],
    [1, 2, 9, 16, 32, 36, 6],
    [2, 11, 12, 25, 32, 33, 21],
    [5, 6, 9, 14, 17, 19, 31],
    [13, 17, 18, 22, 24, 34, 15],
    [15, 18, 19, 27, 30, 32, 29],
    [10, 21, 25, 27, 30, 39, 2],
    [10, 18, 23, 28, 35, 39, 27],
    [1, 3, 4, 9, 10, 20, 28],
    [8, 11, 15, 28, 34, 35, 13],
    [18, 20, 24, 32, 34, 39, 29],
    [1, 3, 8, 10, 26, 38, 18],
    [3, 5, 12, 19, 25, 38, 35],
    [4, 6, 10, 30, 31, 39, 26],
    [8, 12, 18, 27, 32, 36, 11],
    [1, 18, 19, 24, 26, 32, 28],
    [4, 7, 28, 34, 38, 39, 1],
    [4, 13, 22, 28, 32, 36, 26],
    [1, 5, 23, 27, 33, 39, 6],
    [5, 10, 15, 19, 35, 39, 16],
    [3, 8, 24, 29, 31, 35, 10],
    [4, 11, 19, 21, 28, 39, 16],
    [12, 15, 25, 29, 30, 32, 34],
    [10, 11, 13, 22, 23, 30, 21],
    [4, 7, 13, 30, 33, 39, 11],
    [7, 15, 19, 23, 24, 38, 4],
    [13, 14, 17, 23, 31, 35, 6],
    [9, 23, 25, 28, 34, 37, 31],
    [1, 7, 10, 24, 27, 36, 3],
    [2, 10, 18, 23, 31, 34, 15],
    [9, 15, 27, 30, 32, 34, 16],
    [9, 22, 27, 30, 31, 39, 37],
    [1, 16, 18, 21, 23, 26, 10],
    [7, 15, 19, 21, 25, 32, 6],
    [11, 13, 16, 23, 31, 39, 27],
    [3, 13, 16, 26, 31, 35, 2],
    [1, 4, 12, 15, 26, 37, 23],
    [1, 2, 4, 10, 13, 18, 23],
    [1, 18, 21, 26, 34, 36, 29],
    [20, 21, 32, 33, 35, 37, 17],
    [19, 24, 29, 33, 36, 37, 2],
    [22, 26, 33, 35, 36, 39, 13],
    [4, 20, 24, 27, 33, 36, 28],
    [4, 13, 15, 21, 24, 34, 11],
    [15, 20, 25, 27, 28, 36, 2],
    [1, 5, 8, 17, 30, 39, 25],
    [4, 7, 9, 25, 36, 37, 27],
    [12, 14, 21, 32, 36, 38, 11],
    [2, 3, 10, 16, 22, 26, 34],
    [6, 19, 26, 35, 37, 38, 21],
    [3, 17, 20, 21, 22, 39, 8],
    [1, 3, 19, 21, 22, 38, 36],
    [3, 7, 12, 14, 19, 20, 4]
]

const dataSet3 = [
    // [11, 15, 16, 30, 33, 36, 17],
    [4, 7, 9, 12, 21, 42, 41],
    [1, 7, 8, 16, 32, 39, 40],
    [1, 2, 10, 18, 32, 34, 11],
    [6, 17, 24, 28, 30, 32, 42],
    [11, 22, 24, 34, 37, 39, 3],
    [5, 7, 8, 21, 25, 41, 28],
    [1, 5, 18, 28, 33, 40, 23],
    [5, 6, 11, 23, 25, 29, 10],
    [5, 7, 17, 31, 39, 40, 41],
    [4, 12, 13, 20, 37, 38, 16],
    [4, 9, 11, 18, 33, 40, 37],
    [4, 12, 17, 18, 23, 29, 9],
    [2, 7, 20, 24, 26, 33, 6],
    [1, 28, 31, 34, 37, 38, 36],
    [5, 19, 35, 37, 39, 41, 2],
    [6, 9, 12, 32, 37, 40, 23],
    [4, 21, 24, 27, 33, 41, 8],
    [1, 2, 3, 14, 25, 42, 7],
    [1, 5, 7, 9, 20, 36, 42],
    [14, 23, 30, 39, 40, 42, 22],
    [4, 7, 9, 10, 20, 30, 21],
    [10, 11, 23, 27, 30, 37, 13],
    [4, 9, 17, 23, 32, 41, 10],
    [16, 17, 21, 25, 26, 39, 2],
    [3, 4, 7, 15, 29, 37, 36],
    [4, 6, 11, 30, 33, 42, 23],
    [8, 13, 18, 28, 30, 38, 19],
    [15, 20, 22, 26, 29, 36, 41],
    [1, 8, 9, 13, 14, 33, 11],
    [3, 6, 12, 13, 27, 37, 25],
    [13, 14, 25, 27, 34, 42, 10],
    [26, 29, 30, 35, 39, 42, 4],
    [3, 23, 26, 33, 38, 40, 30],
    [3, 16, 22, 30, 31, 41, 39],
    [1, 12, 26, 35, 37, 40, 10],
    [21, 24, 32, 34, 35, 36, 5],
    [8, 15, 17, 21, 26, 42, 9],
    [3, 9, 20, 32, 35, 42, 19],
    [4, 18, 20, 25, 31, 38, 8],
    [2, 4, 19, 22, 24, 41, 14],
    [4, 11, 14, 30, 36, 38, 22],
    [13, 17, 23, 31, 35, 38, 39],
    [2, 4, 7, 13, 28, 34, 26],
    [3, 9, 18, 32, 36, 42, 33],
    [2, 7, 10, 23, 36, 40, 32],
    [1, 6, 16, 31, 36, 37, 2],
    [3, 7, 14, 15, 34, 38, 4],
    [1, 3, 16, 24, 26, 39, 14],
    [9, 16, 21, 26, 31, 37, 28],
    [7, 16, 19, 26, 28, 34, 24],
    [5, 15, 16, 21, 25, 27, 17],
    [7, 11, 26, 33, 35, 39, 27],
    [3, 12, 13, 23, 28, 32, 18],
    [4, 26, 27, 40, 41, 42, 6],
    [1, 5, 18, 19, 22, 25, 17],
    [2, 16, 21, 23, 31, 41, 32],
    [9, 11, 15, 34, 36, 38, 5],
    [14, 16, 17, 18, 21, 33, 35],
    [4, 11, 24, 29, 30, 36, 19],
    [1, 6, 16, 23, 25, 31, 20],
    [7, 10, 11, 15, 20, 38, 25],
    [7, 15, 17, 25, 26, 31, 11],
    [1, 3, 8, 22, 23, 36, 20],
    [4, 14, 18, 35, 36, 40, 41],
    [1, 3, 6, 11, 24, 40, 27],
    [15, 20, 21, 32, 36, 39, 7],
    [3, 16, 25, 32, 33, 39, 28],
    [4, 5, 14, 24, 29, 38, 19],
    [4, 6, 9, 16, 31, 42, 40],
    [12, 16, 24, 27, 34, 36, 10],
    [12, 16, 23, 34, 36, 41, 19],
    [11, 16, 24, 25, 28, 29, 35],
    [11, 20, 22, 23, 33, 39, 6],
    [9, 10, 11, 13, 22, 29, 41],
    [1, 24, 26, 29, 32, 37, 36],
    [14, 17, 28, 29, 35, 38, 3],
    [2, 25, 28, 29, 30, 41, 9],
    [20, 22, 26, 29, 31, 41, 23],
    [7, 12, 15, 24, 28, 37, 41],
    [1, 20, 32, 34, 35, 37, 27],
    [7, 22, 26, 36, 37, 40, 38],
    [1, 3, 7, 30, 37, 38, 12],
    [2, 8, 16, 30, 32, 42, 37],
    [1, 8, 9, 15, 22, 36, 19],
    [4, 11, 13, 15, 24, 39, 12],
    [2, 8, 26, 31, 32, 39, 40],
    [4, 6, 8, 14, 35, 37, 18],
    [7, 10, 15, 20, 35, 40, 1],
    [9, 11, 13, 17, 20, 42, 33],
    [2, 10, 11, 17, 21, 34, 36],
    [4, 5, 14, 16, 32, 41, 35],
    [2, 5, 12, 19, 23, 28, 33],
    [9, 24, 32, 37, 38, 39, 23],
    [5, 15, 21, 24, 27, 31, 14],
    [12, 16, 19, 20, 23, 26, 25],
    [1, 4, 9, 18, 32, 41, 24],
    [16, 17, 18, 23, 26, 34, 24],
    [3, 4, 8, 13, 21, 36, 22],
    [2, 7, 13, 14, 30, 32, 28],
    [5, 7, 13, 30, 32, 38, 18],
    [4, 8, 9, 13, 18, 30, 14],
    [4, 5, 20, 21, 25, 35, 9],
    [6, 9, 14, 34, 35, 39, 38],
    [5, 6, 13, 20, 38, 42, 28],
    [1, 22, 24, 31, 33, 41, 9],
    [6, 11, 19, 30, 37, 40, 26]
]

const dataSet1 = [
    /*[11, 13, 18, 21, 23, 26, 17],
    [4, 6, 7, 10, 16, 25, 38],
    [9, 18, 22, 23, 35, 36, 31],
    [9, 11, 13, 20, 28, 32, 24],
    [6, 16, 18, 19, 33, 37, 9],*/
    [4, 6, 10, 20, 26, 29, 2],
    [10, 17, 29, 32, 33, 35, 13],
    [15, 19, 22, 28, 30, 33, 21],
    [4, 6, 9, 10, 18, 33, 15],
    [10, 14, 15, 25, 28, 37, 17],
    [3, 5, 15, 16, 19, 24, 30],
    [5, 7, 8, 9, 11, 15, 2],
    [9, 17, 20, 24, 25, 31, 21],
    [4, 21, 27, 30, 32, 35, 18],
    [1, 13, 20, 23, 31, 32, 11],
    [7, 8, 18, 27, 36, 37, 34],
    [2, 3, 6, 10, 20, 21, 38],
    [11, 13, 18, 25, 30, 35, 26],
    [15, 16, 27, 28, 32, 36, 11],
    [6, 9, 19, 23, 26, 33, 39],
    [5, 6, 16, 20, 33, 37, 12],
    [5, 6, 7, 14, 22, 39, 34],
    [12, 15, 24, 30, 35, 38, 1],
    [13, 15, 21, 30, 33, 38, 10],
    [7, 8, 14, 24, 25, 39, 15],
    [12, 15, 22, 28, 33, 37, 4],
    [1, 6, 11, 16, 26, 37, 29],
    [16, 19, 20, 24, 25, 33, 39],
    [11, 14, 22, 24, 34, 36, 5],
    [4, 8, 9, 21, 27, 35, 19],
    [9, 10, 14, 28, 30, 38, 20],
    [1, 5, 17, 25, 29, 37, 39],
    [4, 7, 23, 29, 34, 35, 1],
    [7, 18, 28, 30, 31, 33, 29],
    [1, 5, 15, 16, 19, 27, 6],
    [7, 14, 17, 19, 36, 37, 8],
    [11, 20, 21, 28, 34, 36, 16] // */
]

const trainingData = [  // check order
    // ...dataSet3,
    // ...dataSet2,
    ...dataSet1
].reverse()

export const TrainingData = () => {
    let out = []
    for(let i = 3; i < trainingData.length; i++){
        out.push({
            input: [...trainingData[i - 3], ...trainingData[i - 2], ...trainingData[i - 1]].map(a => (a - 1) / 46),
            output: [...Array(47)].map((v, k) => trainingData[i].includes(k) ? 1 : 0)
        })
    }
    return out
}

export const TrainingData0 = () => [
    {output: [1,0], input: [0,0]},
    {output: [0,1], input: [0,1]},
    {output: [0,1], input: [1,0]},
    {output: [1,0], input: [1,1]}
];
    
    
const bfre = trainingData.map((arr, k) => {
    const inputForDataSet = [0.04, 0.06, 0.15, 0.18, 0.23, 0.37, 0.12]
    const ary = arr.map(v => v / 100)
    return k === 0 ? {input: inputForDataSet, output: ary} : {input: trainingData[k - 1].map(v => v / 100), output: ary}
})