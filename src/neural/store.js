import { create } from 'zustand';
import { TrainingData, TrainingData2A } from "./data";
import BasikNeuralNetwork from './basikNN';
import AntagonisticNeuralNetwork from './antagonisticNN';
import GausianNeuralNetwork from './gausianLearnNN';

// add dynamic trainingData and remove the static xor stuff
export const neuralNetworkStore = create(set => ({
    // neuralNet: new BasikNeuralNetwork([21, 40, 60, 100, 70, 47], {cycles: 100}),
    // neuralNet: new AntagonisticNeuralNetwork([21, 40, 60, 100, 70, 47], {cycles: 10000}), // [2,3,4,2]
    neuralNet: new GausianNeuralNetwork([15, 75, 100, 50], TrainingData2A(), {cycles: 10000}),
    containedNetworkTrain: (trainingData) => {
        /* for Basic and Antagonistic NN's
        console.log({trainingData});

        let isOk = Array.isArray(trainingData);
        let len = [];
        if(isOk) trainingData.forEach(obj => {
            if(!len.length) len = [obj.input.length, obj.output.length];
            if(isOk && obj.input.length !== len[0] || obj.output.length !== len[1]) isOk = false;
        })
        if(!isOk) return null;

        set(state => {
            if(state.neuralNet.layers[0] === len[0] && state.neuralNet.layers[state.neuralNet.layers.length - 1] === len[1]) state.neuralNet.learn(trainingData);
            return {};
        }) */

        set(state => {
            state.neuralNet.learn();
            return {};
        })
    },
    containedNetworkRun: () => {
        set(state => {
            const neural = state.neuralNet
            const result1 = neural.predict([
                0.14,0.3,0.36,0.84,0.88,0.28,0.6,0.7,0.72,0.82,0.02,0.04,0.28,0.34,0.62
            ], [ 0,1,0,0,0,1,0,0,1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
                /*0.21739130434782608,
                0.41304347826086957,
                0.43478260869565216,
                0.5869565217391305,
                0.717391304347826,
                0.7608695652173914,
                0.32608695652173914,
                0.13043478260869565,
                0.2826086956521739,
                0.34782608695652173,
                0.391304347826087,
                0.7608695652173914,
                0.782608695652174,
                0.15217391304347827,
                0,
                0.08695652173913043,
                0.30434782608695654,
                0.32608695652173914,
                0.391304347826087,
                0.5652173913043478,
                0.10869565217391304
            ], [
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                1,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                1,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                1,
                1,
                1,
                1,
                0,
                1,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0*/
            ]) // */

            /*const result1 = [
                neural.predict([0,0]),
                neural.predict([0,1]),
                neural.predict([1,0]),
                neural.predict([1,1])
            ]; // */

            console.log(result1)
            return {};
        })
    },
    saveNet: () => {
        set(state => {
            state.neuralNet.save();
            return {};
        })
    },
    loadNet: (data) => {
        set(state => {
            state.neuralNet.load(data);
            return {};
        })
    },
    netInfo: () => {
        let learnRate, layers;

        set(state => {
            const neural = state.neuralNet;
            learnRate = neural.learnRate;
            layers = neural.layers;

            neural.info();
            return {};
        })
        return {layers, learnRate}
    }
}));