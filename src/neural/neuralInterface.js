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

            const {seIsStagnant, setWeights, containedNetworkTrain, containedNetworkRun, input, SetupNetwork, setState, layers, learnRate, weights, biases} = neuralNetworkStore(state => ({
                learnRate: state.learnRate, 
                layers: state.layers || [], 
                setState: state.setState, 
                input: state.input || [], 
                SetupNetwork: state.setupNetwork,
                weights: state.weights,
                biases: state.biases,
                containedNetworkRun: state.containedNetworkRun,
                containedNetworkTrain: state.containedNetworkTrain,
                setWeights: state.setWeights,
                seIsStagnant: state.seIsStagnant
            }))
        
            React.useEffect(() => {
                // load weights and biases
            },[])
        
            // need to select the input data for the network to act on - training or not
            // const layers = [10, 14, 7] // nodes in layers excluding the input layer
        
            const runNeural = () => {

                SetupNetwork()

                /* NeuralNetwork(
                    (prediction, handleNeuralAdjust) => {
                        setAskUser({
                            text: 'Evaluate Neural Network prediction',
                            dataSet: prediction,
                            onSubmit: (userInput) => {
                                setAskUser({text: 'Adjusting Network weights and biases'})
                                handleNeuralAdjust({userInput, prediction})
                            }
                        })
                    },
                    predictOutput
                ) */
            }
        
            // on BasicModal Click - ask to set input - need inputlength for train
            // train, run test
        
            return <Box sx={styles.main}>
                <Button onClick={() => containedNetworkTrain()} >train example</Button>
                <Button onClick={() => containedNetworkRun()} >run example</Button>
                <Button onClick={() => setWeights(weights)} >setWeights</Button>
                <Button onClick={() => seIsStagnant()} >seIsStagnant</Button>
                <Typography>Testing Neural Network</Typography>
                <Button sx={styles.button}><ReadFileData  set={(v) => setState(JSON.parse(v))}/></Button>
                <BasicModal buttonStyle={styles.modalButton} {...{dataSet: [input.length], onSubmit: (arr) => setState({input: [...Array(arr[0])]})}} buttonText={`Set Input Size : ${input.length}`} />
                <BasicModal buttonStyle={styles.modalButton} {...{dataSet: input, onSubmit: (arr) => setState({input: arr})}} buttonText='Set Inputs' />
                <BasicModal buttonStyle={styles.modalButton} {...{dataSet: [layers.length], onSubmit: (arr) => setState({layers: [...Array(arr[0])]})}} buttonText={`Set Number of Layers : ${layers.length}`} />
                <BasicModal buttonStyle={styles.modalButton} {...{dataSet: layers, onSubmit: (arr) => setState({layers: arr})}} buttonText='Set Up Layers' />
                <BasicModal buttonStyle={styles.modalButton} {...{dataSet: [learnRate], onSubmit: (arr) => setState({learnRate: arr[0]})}} buttonText={`Set LearnRate : ${learnRate}`} />
                <Button sx={styles.button} onClick={() => TrainingData ? SetupNetwork(TrainingData, 10000) : console.log('No training Data')}>Train</Button>
                <BasicModal onClick={runNeural} buttonStyle={styles.modalButton} label1='predicted' {...askUser} buttonText='Run Neural Network' />
                <Button sx={styles.button} onClick={() => weights.length && biases.length ? saveFileData({weights, biases, input, layers, learnRate}, 'dataSetOne') : console.log('No Data to save')}>Save to File</Button>
            </Box>
        }
        
        function predictOutput(prediction){
            let out = []
        
            const findMaxKey = (arr) => {
                let highestKey = []
                let maxVal = 0
        
                arr.forEach((v, k) => {
                    if(v > maxVal) {
                        maxVal = v
                        highestKey = [k]
                    }else if(v === maxVal) highestKey.push(k)
                })
        
                return highestKey
            }
        
            let ary = [...prediction]
            while(out.length < 7){
                let keys = findMaxKey(ary)
                out.push(...keys)
        
                ary = ary.map((v, k) => keys.includes(k) ? -100 : v)
            }
        
            return out.map(a => a + 1)
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