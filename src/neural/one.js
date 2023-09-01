/*
No: 1
create a neural network - take in an image and find something in it

Input: 
    blueprint
    image

Result: 
    an image with only what matches the plueprint
*/

/*
toDo :  1: refactor
        2: 1 buttun to train 
        3: 1 button to run the network - ask for input, 
        4: then ask if you want to set sugested outputs - if so then learn on user input
        5: gui to set layers
        */

import React from "react";
import BasicModal, { ShowDataSet } from "../molecules/popup";
import { Box, Button, Typography } from "@mui/material";
import { saveFileData, ReadFileData } from "../io/fileIO";
import { TrainingData } from "./data";
import { neuralNetworkStore } from "./store";

/**
 * this function interacts between the neural network, us and the computer - ask for validation - load assests - display data - start training or run task
 * @param {String} wieghtLocation or arr of strings ?
 * @param {String} biasLocation or arr of strings ?
 * @returns 
 */
export default function NeuralInterface() {
    const [askUser, setAskUser] = React.useState({}) // ask user to validate something from neural network

    const layers = neuralNetworkStore(state => state.semiStaticData.layers);
    const learnRate = neuralNetworkStore(state => state.semiStaticData.learnRate);

    const weightsAndBiases = neuralNetworkStore(state => state.weightsAndBiases);
    const setState = neuralNetworkStore(state => state.setState)

    const NeuralNetwork = neuralNetworkStore(state => state.NeuralNetwork)
    const input = neuralNetworkStore(state => state.input)

    const TrainNetwork = neuralNetworkStore(state => state.TrainNetwork)

    React.useEffect(() => {
        // load weights and biases
    },[])

    // need to select the input data for the network to act on - training or not
    // const layers = [10, 14, 7] // nodes in layers excluding the input layer

    const runNeural = () => {
        NeuralNetwork(
            (prediction, handleNeuralAdjust) => {
                setAskUser({
                    text: 'Evaluate Neural Network prediction',
                    dataSet: prediction,
                    onSubmit: (userInput) => {
                        setAskUser({text: 'Adjusting Network weights and biases'})
                        handleNeuralAdjust({userInput, prediction})
                    }
                })
            }
        )
    }

    // on BasicModal Click - ask to set input
    // train, run test

    return <Box sx={styles.main}>
        <Typography>Testing Neural Network</Typography>
        <Button sx={styles.button}><ReadFileData  set={(v) => setState(JSON.parse(v))}/></Button>
        <BasicModal buttonStyle={styles.modalButton} {...{dataSet: [input.length], onSubmit: (arr) => setState({input: [...Array(arr[0])]})}} buttonText={`Set Input Size : ${input.length}`} />
        <BasicModal buttonStyle={styles.modalButton} {...{dataSet: input, onSubmit: (arr) => setState({input: arr})}} buttonText='Set Inputs' />
        <BasicModal buttonStyle={styles.modalButton} {...{dataSet: [layers.length], onSubmit: (arr) => setState({layers: [...Array(arr[0])]})}} buttonText={`Set Number of Layers : ${layers.length}`} />
        <BasicModal buttonStyle={styles.modalButton} {...{dataSet: layers, onSubmit: (arr) => setState({layers: arr})}} buttonText='Set Up Layers' />
        <BasicModal buttonStyle={styles.modalButton} {...{dataSet: [learnRate], onSubmit: (arr) => setState({learnRate: arr[0]})}} buttonText={`Set LearnRate : ${learnRate}`} />
        <Button sx={styles.button} onClick={() => TrainNetwork(TrainingData)}>Train</Button>
        <BasicModal onClick={runNeural} buttonStyle={styles.modalButton} label1='predicted' {...askUser} buttonText='Run test' />
        <Button sx={styles.button} onClick={() => Object.keys(weightsAndBiases).length ? saveFileData(weightsAndBiases, 'dataSetOne') : null}>Save to File</Button>
    </Box>
/*
    return <Box sx={{display: 'flex', flexDirection: 'column', margin: 5, justifyContent: 'space-around'}}>
        <Typography>Testing Neural Network</Typography>
        <ReadFileData  set={(v) => setState(JSON.parse(v))}/>
        <BasicModal onClick={runNeural} {...askUser} buttonText='Start Neural Network' />
        <Button sx={{width: 220}} onClick={() => Object.keys(weightsAndBiases).length ? saveFileData(weightsAndBiases, 'dataSetOne') : null}>Save Weights and Biases</Button>
        <Button sx={{width: 220}} onClick={() => TrainNetwork({input, layers, ActivationFunct, weightsAndBiases, setState, learnRate})}>Train</Button>
        <ShowDataSet label1='current input' label2='set' dataSet={input} onChange={({val, k}) => {
            let arr = [...input]
            arr[k] = val
             setInput(arr)
        }} />
    </Box> */
}

const styles = {
    main: {
        with: 150,
        maxWidth: 200,
        height: 400,
        margin: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        textAlign: 'center',
        padding: 2,
        backgroundColor: 'oldlace'
    },
    modalButton: {
        color: 'black',
        backgroundColor: 'yellow',
        width: '90%'
    },
    button: {
        color: 'black',
        backgroundColor: 'yellow',
        width: '90%',
        left: '5%'
    }
}