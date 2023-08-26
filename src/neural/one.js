/*
No: 1
create a neural network - take in an image and find something in it

Input: 
    blueprint
    image

Result: 
    an image with only what matches the plueprint
*/

import React from "react";
import BasicModal from "../molecules/popup";
import { Box, Button, Typography } from "@mui/material";
import { exportUserInfo } from "../io/fileIO";

/**
 * this function interacts between the neural network, us and the computer - ask for validation - load assests - display data - start training or run task
 * @param {String} wieghtLocation or arr of strings ?
 * @param {String} biasLocation or arr of strings ?
 * @returns 
 */
export default function NeuralInterface() {
    const [state, setstate] = React.useState({})
    const setState = (obj) => setstate({...state, ...obj}) // save this to file ...
    const [askUser, setAskUser] = React.useState({showModal: false}) // ask user to validate something from neural network

    React.useEffect(() => {
        // load weights and biases
    },[])

    // need to select the input data for the network to act on - training or not
    const input = [0, 0]
    const layers = [3, 2] // nodes in layers excluding the input layer
    

    const runNeural = () => {
        NeuralNetwork(
            input,
            layers,
            state,
            setState,
            (neuralPrediction, handleNeuralAdjust) => { // this function allows for the cost to be calculated in responce to Input - user or other
                setAskUser({
                    showModal: true, 
                    text: 'Evaluate Neural Network prediction',
                    dataSet: neuralPrediction,
                    onSubmit: (userInput) => {
                        setAskUser({showModal: true, text: 'Adjusting Network weights and biases'})
                        handleNeuralAdjust(userInput, () => setAskUser({showModal: false}))
                    },
                    onClose: () => setAskUser({showModal: false})
                })
            }
        )
    }

    return <Box sx={{display: 'flex', flexDirection: 'column', margin: 5}}>
        <Typography>Testing Neural Network</Typography>
        <BasicModal onClick={runNeural} {...askUser} buttonText='Start Neural Network' />
    </Box>
}

// --------

/**
 * 
 * @param {Array[Number]} input input.length is the number of input nodes
 * @param {Array[Number]} layers arr.length is number of node layers and each value is the number of nodes therein
 * @param {Array[Array[Number]]} weights arr[0] weights between layers[0] and layers[1], ... - like biases
 * @param {Array[Array[Number]]} biases arr[1] biases between layers[1] and layers[2], ... - like weights
 */
function NeuralNetwork(input, layers, {weights = [], biases = []}, setState, askForValidation){
    // all node layers together
    let nodesIn = [...input]

    const set = (obj, k) => {
        if(obj.weights){
            /*let arr = [...weights]
            if(arr.length >= (k + 1)) arr[k] = obj.weights
            else {
                while(arr.length < (k + 1)) arr.push([])
                arr[k] = obj.weights
            }
            setState({weights: arr}) */
            buildMultiArray({set: setState, ary: weights, key: 'weights', k, obj})
        }else if(obj.biases){
            /*let arr = [...biases]
            if(arr.length >= (k + 1)) arr[k] = obj.biases
            else {
                while(arr.length < (k + 1)) arr.push([])
                arr[k] = obj.biases
            }
            setState({biases: arr}) */
            buildMultiArray({set: setState, ary: biases, key: 'biases', k, obj})
        }
    }

    layers.forEach((v, k) => {
        nodesIn = [...basicNeuralNetwork({nodesIn, nodesOut: layers[k], weights: weights[k], biases: biases[k]}, (a) => set(a, k), askForValidation, k)]
    });

    // calculate cost here
}

function buildMultiArray({ary, set, key, k, obj}){
    let arr = [...ary]
    if(arr.length >= (k + 1)) arr[k] = obj[key]
    else {
        while(arr.length < (k + 1)) arr.push([])
        arr[k] = obj[key]
    }
    console.log(arr)
    set({[key]: arr})
}

/**
 * this is for one step between neuron layers
 * @param {Array[Number]} nodesIn input.length is the number of input nodes
 * @param {Number} nodesOut the number of output nodes
 * @param {Arrau[Number]} weights length = nodes out * nodesIn.length
 * @param {Array[Number]} biases length = nodesIn.length
 * @param {function} askForValidation validate the data against another neural network or from user input
 * @train varies nodesIn to adjust the weights and biases depending on the cost calculated for nodesOut
 */
function basicNeuralNetwork({nodesIn, nodesOut, weights = [], biases = []}, setState, askForValidation){
    if(!nodesIn.length || !nodesOut) {
        console.log('nodes missing')
        return null
    }

    let mod = []

    if(weights.length !== nodesIn.length * nodesOut){
        console.log('resetting weights')
        weights = Array.from({length: nodesIn.length * nodesOut}, () => Math.random())
        if(!mod.includes('weights')) mod.push('weights')
    }

    if(biases.length !== nodesIn.length){
        console.log('resetting biases')
        biases = Array.from({length: nodesIn.length}, () => Math.random() * 10)
        if(!mod.includes('biases')) mod.push('biases')
    }

    /// ... - adjust to allow for nodes of various dimentions 
    const classify = () => {
        let out1 = nodesIn[0] * weights[0] + nodesIn[0] * weights[1]
        let out2 = nodesIn[1] * weights[2] + nodesIn[1] * weights[3]

        return [out2, out1]
    }

    const predicted = classify()

    const keepData = (externalInput, closeModal) => {
        console.log({predicted, externalInput, weights, biases, mod})

        // calc cost and apply - we might not be able to do this at this point - eg if the output nodes are fed into another funct as inputs

        // update relevent states - handle somewhere ...
        if(mod.includes('weights')) setState({weights})
        if(mod.includes('biases')) setState({biases})

        // finally we close the Modal
        closeModal()
    }

    // ask user for input (correct ? incorrect ?) || self adjust (I would love to let 2+ networks run in parrallel until they are of equil opinion)
    askForValidation(predicted, keepData)
    return predicted
}



/*
1: steps between layers
2: overall network
3: multiple networks and display
*/