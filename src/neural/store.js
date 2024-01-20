import { create } from 'zustand';
import BasikNeuralNetwork from './basikNN';

const DEBUGs = 0;
const DEBUGf = 0;
const DEBUGb = 0;

// running with file in test folder
// [0.5079398807680949]

// let us test the network - I want to see how stable the increase is 
/* - stable (0) 
*/

// lets try adding a function to modify the learnrate dynamically - I hope this speeds things up

export const neuralNetworkStore = create(set => ({
    exampleNet: new BasikNeuralNetwork([2, 3, 4, 2], {cycles: 100}),
    containedNetworkTrain: () => {
        set(state => {
            const neural = state.exampleNet
            const train_data = [
                {output: [1,0], input: [0,0]},
                {output: [0,1], input: [0,1]},
                {output: [0,1], input: [1,0]},
                {output: [1,0], input: [1,1]},
            ]
            neural.learn(train_data);
            neural.info()
            return {};
        })
    },
    containedNetworkRun: () => {
        set(state => {
            const neural = state.exampleNet
            const result1 = neural.predict([0,0], [1,0])
            const result2 = neural.predict([1,0], [0,1])
            const result3 = neural.predict([0,1], [0,1])
            const result4 = neural.predict([1,1], [1,0])

            console.log(result1, result2, result3, result4)
            return {};
        })
    },
    saveNet: () => {
        set(state => {
            state.exampleNet.save();
            return {};
        })
    },
    loadNet: (data) => {
        set(state => {
            state.exampleNet.load(data);
            return {};
        })
    },
    netInfo: () => {
        let learnRate, layers;

        set(state => {
            const neural = state.exampleNet;
            learnRate = neural.learnRate;
            layers = neural.layers;

            neural.info();
            return {};
        })
        return {layers, learnRate}
    }
}));