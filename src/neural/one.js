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
import { saveFileData, SelectFileData, ReadFileData } from "../io/fileIO";

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
            (prediction, handleNeuralAdjust) => { // this function allows for the cost to be calculated in responce to Input - user or other
                setAskUser({
                    showModal: true, 
                    text: 'Evaluate Neural Network prediction',
                    dataSet: prediction,
                    onSubmit: (userInput) => {
                        setAskUser({showModal: true, text: 'Adjusting Network weights and biases'})
                        handleNeuralAdjust(userInput, () => setAskUser({showModal: false}), prediction)
                    },
                    onClose: () => setAskUser({showModal: false})
                })
            }
        )
    }

    return <Box sx={{display: 'flex', flexDirection: 'column', margin: 5, justifyContent: 'space-around'}}>
        <Typography>Testing Neural Network</Typography>
        <ReadFileData  set={(v) => setState(JSON.parse(v))}/>
        <BasicModal onClick={runNeural} {...askUser} buttonText='Start Neural Network' />
        <Button sx={{width: 220}} onClick={() => Object.keys(state).length ? saveFileData(state, 'dataSetOne') : null}>Save Weights and Biases</Button>
    </Box>
}

/**
 * a single neural network
 * @param {Array[Number]} input input.length is the number of input nodes
 * @param {Array[Number]} layers arr.length is number of node layers and each value is the number of nodes therein
 * @param {Array[Array[Number]]} weights arr[0] weights between layers[0] and layers[1], ... - like biases
 * @param {Array[Array[Number]]} biases arr[1] biases between layers[1] and layers[2], ... - like weights
 */
function NeuralNetwork(input, layers, {weights, biases}, setState, askForValidation){
    // create random weights and biases if they don't exist
    if(!weights || weights.length !== layers.length){
        let randomWeights = [], nodesIn = input.length

        layers.forEach(nodesOut => {
            randomWeights.push(Array.from({length: nodesIn * nodesOut}, () => Math.random()))
            nodesIn = nodesOut
        })
        weights = randomWeights
    }
    if(!biases || biases.length !== layers.length){
        let randomBiases = []

        layers.forEach(nodesOut => {
            randomBiases.push(Array.from({length: nodesOut}, () => Math.random()))
        })
        biases = randomBiases
    }

    const adjustData = (userInput, closeModal, prediction) => {
        // calculate cost here
        // nodesIn at this point is the predicted output

        // find largest probability
        let out = [0, 0]
        prediction.forEach((v, k) => {
            if(v > out[0]) out = [v, k]
        })
        console.log({chosen: out[1], confidance: out[0], prediction})

        // update state
        setState({weights, biases})

        // finally we close the Modal
        closeModal()
    }

    let nodesIn = [...input]
    layers.forEach((nodesOut, k) => {
        nodesIn = [...basicNeuralNetwork(
            {nodesIn, nodesOut, weights: weights[k], biases: biases[k]},
            k === (layers.length - 1) ? (prediction) => askForValidation(prediction, adjustData) : null
        )]
    });
}

/**
 * this is for one step between neuron layers
 * @param {Array[Number]} nodesIn input.length is the number of input nodes
 * @param {Number} nodesOut the number of output nodes
 * @param {Arrau[Number]} weights length = nodes out * nodesIn.length
 * @param {Array[Number]} biases length = nodesOut
 * @param {function} askForValidation validate the data against another neural network or from user input
 * @train varies nodesIn to adjust the weights and biases depending on the cost calculated for nodesOut
 */
function basicNeuralNetwork({nodesIn, nodesOut, weights, biases}, askForValidation){

    const cakcOutputNodeValues = () => {
        let weightedInputs = []

        for(let i = 0; i < nodesOut; i++){
            let weightedInput = biases[i]
            nodesIn.forEach((v, k) => {
                weightedInput += (v * weights[i * nodesIn.length + k])
            })
            weightedInputs.push(weightedInput)
        }

        return weightedInputs // pump onto sigmoid here ?
    }

    const prediction = cakcOutputNodeValues()

    // ask user for input (correct ? incorrect ?) || self adjust (I would love to let 2+ networks run in parrallel until they are of equil opinion)
    if(askForValidation) askForValidation(prediction)
    return prediction
}