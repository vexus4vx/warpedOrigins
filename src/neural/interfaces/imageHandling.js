import React from "react";

import { LoadFile, ReadFileData, saveFileData } from "../../io/fileIO";
import { Button } from "@mui/material";
import TopMenu from "../../molecules/topMenu";

export function Interface({imgStyle}) {
    const [aiData, setAiData] = React.useState()
    
    return <div style={{margin: 40, display: 'flex', flexDirection: 'column', maxWidth: 240}}>
        Load File
        <ReadFileData set={(data) => setAiData(JSON.parse(data))} />

        <div style={{marginTop: 40, display: 'flex', flexDirection: 'column'}}>
            we need to add stuff for configuring the returned data here,
            <button>run neural network</button>
            show something?
        </div>

        <button style={{width: 87, marginTop: 15}} onClick={() => aiData ? saveFileData({...aiData}, 'dataSetOne') : console.log('No Data to save')}>Save to File</button>
    </div>
}

export function ImageDisplay() {
    return <div style={{marginTop: 50}}>
        Resulting image
        <div style={{marginTop: 40, height: 350, width: 400, ...styles.framedBorder}}>
            - lets try to do this ...
        </div>
    </div>
}

export function ImageHandling() {
    return <div style={styles.main}>
        <TopMenu/>
        <div style={styles.inner}>
            <LoadFile imgStyle={styles.framedBorder} />
            <Interface imgStyle={styles.framedBorder} />
            <ImageDisplay />
        </div>
    </div>
}

const styles = {
    framedBorder: {
      borderRadius: 10,
      borderWidth: 5,
      borderColor: 'white',
      borderStyle: 'solid'
    },
    filedata: {
      display: 'flex',
      flexDirection: 'column',
      margin: 10
    },
    main: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        backgroundColor: '#282c34',
        color: 'white',
        fontSize: 'calc(12px + 2vmin)'
    },
    inner: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100vw',
        height: '100vh',
        overflowY: 'hidden',
        overflowX: 'auto',
        backgroundColor: '#282c34',
        color: 'white',
        fontSize: 'calc(10px + 2vmin)'
    }
}