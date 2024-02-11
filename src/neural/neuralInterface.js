import React from "react";
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
    const [info, setInfo] = React.useState({});

    const {netInfo, saveNet, loadNet, containedNetworkTrain, containedNetworkRun, setState} = neuralNetworkStore(state => ({
        setState: state.setState,
        SetupNetwork: state.setupNetwork,
        containedNetworkRun: state.containedNetworkRun,
        containedNetworkTrain: state.containedNetworkTrain,
        saveNet: state.saveNet,
        loadNet: state.loadNet,
        netInfo: state.netInfo
    }))

    React.useEffect(() => {
        const obj = netInfo();
        setInfo(obj);
    },[])

    return <Box sx={styles.main}>
        <Button onClick={() => netInfo()} >net info</Button>
        <Button>{info?.learnRate ? `learnRate: ${info?.learnRate}` : ''}</Button>
        <Button>{info?.layers ? `layers: ${JSON.stringify(info?.layers)}` : ''}</Button>
        <Typography>Testing Neural Network</Typography>
        <Button sx={styles.button}><ReadFileData  set={(v) => loadNet(v)}/></Button>
        <Button sx={styles.button} onClick={() => containedNetworkTrain(TrainingData())} >train net</Button>
        <Button sx={styles.button} onClick={() => containedNetworkRun()} >run net</Button>
        <Button sx={styles.button} onClick={() => saveNet()}>Save to File</Button>
    </Box>
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