import React from "react";

import { LoadFile, saveFileData } from "../../io/fileIO";
import TopMenu from "../../molecules/topMenu";
import { artStore } from "./store";
import axios from "axios";
import { Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import { DisplayList } from "../../molecules/displayList";
import { ModObject } from "./ImageMod";
import { useCanvas } from "../../symulation/interface/hooks";

// add a mod where we only display the area selected ?
// we need a mod that will detect edges and color each independant section differently

export function ImageModInterFace() {
    // const [aiData, setAiData] = React.useState();
    const [slct, setSlct] = React.useState('');
    const {addMod, mods, removeMod, setColor, pixColor, range, setState} = artStore(state => {
        return {addMod: state.addMod, mods: state.mods, removeMod: state.removeMod, setColor: state.setColor, pixColor: state.pixColor, range: state.range, setState: state.setState}
    });
    
    return <div style={{margin: 40, display: 'flex', flexDirection: 'column', maxWidth: 240}}>
        {/*Load File
        <ReadFileData set={(data) => setAiData(JSON.parse(data))} />*/}

        <Typography style={{paddingBottom: 30}}>Select Mods</Typography>
        <div style={{display: 'flex'}}>
            <TextField label='r' InputLabelProps={{shrink: true}} value={pixColor.r} onChange={(e) => setColor({r: parseInt(e.target.value, 10) || 0})}/>
            <TextField label='range: R' InputLabelProps={{shrink: true}} value={pixColor.rangeR} onChange={(e) => setColor({rangeR: parseInt(e.target.value, 10) || 0})}/>
        </div>
        <div style={{display: 'flex'}}>
            <TextField label='g' InputLabelProps={{shrink: true}} value={pixColor.b} onChange={(e) => setColor({b: parseInt(e.target.value, 10) || 0})}/>
            <TextField label='range: G' InputLabelProps={{shrink: true}} value={pixColor.rangeG} onChange={(e) => setColor({rangeG: parseInt(e.target.value, 10) || 0})}/>
        </div>
        <div style={{display: 'flex'}}>
            <TextField label='b' InputLabelProps={{shrink: true}} value={pixColor.g} onChange={(e) => setColor({g: parseInt(e.target.value, 10) || 0})}/>
            <TextField label='range: B' InputLabelProps={{shrink: true}} value={pixColor.rangeB} onChange={(e) => setColor({rangeB: parseInt(e.target.value, 10) || 0})}/>
        </div>
        <TextField label='range' InputLabelProps={{shrink: true}} value={range} onChange={(e) => setState({range: parseInt(e.target.value, 10) || 0})}/>
        <FormControl sx={{ m: 1, minWidth: 120, paddingBottom: 5 }} size="small">
            <InputLabel>Mods</InputLabel>
            <Select
                value={slct}
                onChange={(e) => {
                    setSlct('');
                    addMod(e.target.value);
                }}
            >
                {Object.keys(ModObject).map(k => <MenuItem key={k} value={k}>{k}</MenuItem>)}
            </Select>
        </FormControl>

        <Typography style={{paddingBottom: 30}}>Current Mods in Order</Typography>

        <DisplayList arr={mods} onChange={(i) => removeMod(i)}/>
    </div>
}

export function ImageDisplay() {
    const innerStyle = {marginTop: 40, height: 350, width: 400, ...styles.framedBorder, overflow: 'auto'};
    const dataURL = artStore(state => state.dataURL);

    return <div style={{marginTop: 50}}>
        Resulting image
        <div style={innerStyle}>
            <img src={dataURL} width={innerStyle.width} height={innerStyle.height} />
        </div>
    </div>
}

export function ImageHandling() {
    const {setWebImg, setImg, saveAsGameMap} = artStore(({saveAsGameMap, setImg, setWebImg}) => {
        return {setWebImg, setImg, saveAsGameMap}
    });

    const handleLoad = (obj, isWebImg) => {
        if(obj) {
            //if(isWebImg) setWebImg(obj);
            //else 
            setImg(obj);
        }
    }

    return <div style={styles.main}>
        <TopMenu/>
        <div style={styles.inner}>
            <LoadFile setParams={handleLoad} imgStyle={styles.framedBorder} />
            <div>
                <ImageModInterFace />
                <Button onClick={saveAsGameMap}>Save as Game Map</Button>
            </div>
            <ImageDisplay />
        </div>
        {/*<FullCanvas />*/}
    </div>
}

// this will need some edits for when the data is linked to the mod
export function FullCanvas(){
    const [needDrawn, setNeedDrawn] = React.useState(0);
    //const [functs, setFuncts] = React.useState([]);
    const [prevModCount, setPrevModCount] = React.useState(0);
    // const [uri, setUri] = React.useState();
    const {url, width, height, setState, mods, modifiedPixelData} = artStore(state => {
        return {url: state.url, width: state.width, height: state.height, setState: state.setState, mods: state.mods, modifiedPixelData: state.modifiedPixelData}
    });

    React.useEffect(() => {
        if(mods && (mods.length !== prevModCount)){
            // setFuncts(mods.map(a => ModObject[a]));
            setPrevModCount(mods.length);
            setNeedDrawn(2);
        }
    }, [mods])

    React.useEffect(() => {
        if(url) {
            // getBase64(url, setUri);
            setNeedDrawn(1); // delay this ?
        }
    }, [url])

    const draw = ((ctx, canvas, frameCount) => {
        if(needDrawn === 1){
            setTimeout(function(){
                let img = new Image();
                // img.src = uri || url;
                img.src = url;
                
                ctx.drawImage(img,0,0);
                const imageData = ctx.getImageData(0, 0, width, height);
                const dataURL = canvas.toDataURL()
                setState({originalPixelData: imageData.data, dataURL})
            }, 10);

            /* setTimeout(function(){
                if(needDrawn){
                    let img = new Image();
                    // img.src = uri || url;
                    img.src = url;
                    
                    ctx.drawImage(img,0,0);

                    const imageData = ctx.getImageData(0, 0, width, height);

                    //

                    if(functs.length){
                        functs.forEach(funct => { // not efficient
                            funct(imageData.data, width, height);
                        })
                        ctx.putImageData(imageData, 0, 0);
                    }
                    const dataURL = canvas.toDataURL()
                    setState({imageData, dataURL});
                }
            }, 200); */
        }else if(needDrawn === 2){
            const imageData = new ImageData(Uint8ClampedArray(modifiedPixelData), width, height)
            // ctx.putImageData(imageData, 0, 0);
        }

        if(needDrawn) setNeedDrawn(0);
    })

    // hide from view
    return <div style={{overFlow:'auto', maxHeight: 0, top: 10}}>
        {url ? <Canvas {...{width, height, draw}} /> : null}
    </div>
}

export function Canvas({draw = () => {}, ...rest}){
    const canvasRef = useCanvas(draw);

  return <canvas ref={canvasRef} {...rest}/>
}

// try to fix this 
const getBase64 = async(url, setUri)=>{
    try {
      let image = await axios.get(url, { 
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Content-Type': "*",
                'Access-Control-Accept': "*"
            }, 
            responseType: 'arraybuffer' 
        });
        let raw = Buffer.from(image.data).toString('base64');
        const out = "data:" + image.headers["content-type"] + ";base64,"+raw;
        setUri(out);
    } catch (error) {
        console.log(error);
    } 
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