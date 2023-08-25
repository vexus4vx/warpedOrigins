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
import BasicModal, { ModalDialogOverflow } from "../molecules/popup";
import { Box, Button, Typography } from "@mui/material";

export default function Neural1({requireUserInfo = true}) {
    const [state, setstate] = React.useState({})
    const setState = (obj) => setstate({...state, ...obj}) // save this to file ...

    const [askUser, setAskUser] = React.useState({showModal: false}) // ask user to validate something from neural network

    const runNeural = () => {
        basicNeuralNetwork(
            state,
            setState,
            (neuralPrediction, handleNeuralAdjust) => {
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


// could do this better but so what
function xor (a, b) {
    return (!(!a & b) & (a & !b)) | (!(a & !b) & (!a & b))
}

const trainingData = [
    {in: [0, 0], out: 0},
    {in: [0, 1], out: 1},
    {in: [1, 0], out: 1},
    {in: [1, 1], out: 0}
]

// --------

/**
 * this is for one step from the input to the first node - of course the input may consist of nodes
 * @param {Array[Numbers]} nodesIn input.length is the number of input nodes
 * @param {Number} nodesOut the number of output nodes
 * @param {Arrau[Numbers]} weights length = nodes out * nodesIn.length
 * @param {Array[Number]} biases length = nodesIn.length
 * @param {function} askForValidation validate the data against another neural network or from user input
 * @train varies nodesIn to adjust the weights and biases depending on the cost calculated for nodesOut
 */
function basicNeuralNetwork({nodesIn = [0, 0], nodesOut = 2, weights = [], biases = []}, setState, askForValidation){
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
        console.log({externalInput, weights, biases, mod})

        // calc cost and apply - we might not be able to do this at this point - eg if the output nodes are fed into another funct as inputs

        // update relevent state - check mod

        // finally we close the Modal
        closeModal()
    }

    // ask user for input (correct ? incorrect ?) || self adjust (I would love to let 2+ networks run in parrallel until they are of equil opinion)
    askForValidation(predicted, keepData)
}