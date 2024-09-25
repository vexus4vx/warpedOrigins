import { create } from 'zustand';
import { TrainingData, TrainingData2A, TrainingDataN3 } from "./data";
import BasikNeuralNetwork from './basikNN';
import AntagonisticNeuralNetwork from './antagonisticNN';
import GausianNeuralNetwork from './gausianLearnNN';

// [2: [85.7:14.2], 15: [92.8:7.1], 18: [85.7:14.2], 27: [85.7:14.2], 29: [99.8:0.1], 38: [?:?], 30: [88:11.8]] // all val: [n:y]
const tdn = 38; // trainingDataNumber

// add dynamic trainingData and remove the static xor stuff
export const neuralNetworkStore = create(set => ({
    // neuralNet: new BasikNeuralNetwork([21, 40, 60, 100, 70, 47], {cycles: 100}),
    // neuralNet: new AntagonisticNeuralNetwork([21, 40, 60, 100, 70, 47], {cycles: 10000}), // [2,3,4,2]
    // neuralNet: new GausianNeuralNetwork([15, 75, 100, 50], TrainingData2A(), {cycles: 10000}), // why 15 ???
    neuralNet: new GausianNeuralNetwork([21, 49, 49, 3], TrainingDataN3(tdn), {cycles: 1, findG: 91}),
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
            const neural = state.neuralNet;
            let tData = TrainingDataN3(tdn);
            tData = tData[tData.length - 1];
            console.log({tData})
            const result1 = neural.predict(tData.input, tData.output);

            console.log({trainingData: tData, prediction: result1})
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


/*
    1: get some usable data into data.js
    2: train 3 types of networks on the data and see which preforms best
    3: train repeat 1 and 2 for a different data set and compare results
*/