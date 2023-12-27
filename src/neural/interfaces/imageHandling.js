import React from "react";

import { LoadFile, saveFileData } from "../../io/fileIO";
import TopMenu from "../../molecules/topMenu";
import { GeneralButton } from "../../atoms/button";
import { artStore } from "./store";

export function ImageModInterFace() {
    const [aiData, setAiData] = React.useState()
    
    return <div style={{margin: 40, display: 'flex', flexDirection: 'column', maxWidth: 240}}>
        {/*Load File
        <ReadFileData set={(data) => setAiData(JSON.parse(data))} />*/}

        <div style={{paddingBottom: 50}}>Lets try our hand at some image handling</div>

        <GeneralButton onClick={() => console.log('do something')}>
            Blur Image
        </GeneralButton>

        <GeneralButton onClick={() => aiData ? saveFileData({...aiData}, 'modImage') : console.log('No Data to save')} />
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
    const setState = artStore(state => state.setState);

    return <div style={styles.main}>
        <TopMenu/>
        <div style={styles.inner}>
            <LoadFile setParams={(obj) => setState(obj)} imgStyle={styles.framedBorder} />
            <ImageModInterFace imgStyle={styles.framedBorder} />
            <ImageDisplay />
        </div>
        <FullCanvas />
    </div>
}

// this will need som edits for when the data is linked to the mod
export function FullCanvas(){
    const [needDrawn, setNeedDrawn] = React.useState(false);
    const {url, width, height, setState} = artStore(state => {
        return {url: state.url, width: state.width, height: state.height, setState: state.setState}
    });

    React.useEffect(() => {
        if(url) {
            setNeedDrawn(true);
        }
    }, [url])

    const draw = ((ctx, canvas, frameCount) => {
        if(needDrawn){
            setNeedDrawn(false);
            setTimeout(function(){
                if(needDrawn){
                    let img = new Image();
                    img.src = url;
                    ctx.drawImage(img,0,0);

                    // proof of concept
                    ctx.fillStyle = '#ff0000'
                    ctx.fillRect(50, 40, 100, 100)

                    const pixelData = ctx.getImageData(0, 0, height, width);
                    // when pushing the mod to this use
                    // ctx.putImageData(ModifiedPixelData, 0, 0);

                    const dataURL = canvas.toDataURL()
                    setState({pixelData, dataURL});
                }
            }, 500);
        }
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

// Hook
const useCanvas = (draw, setPixelArray) => {
    const canvasRef = React.useRef(null)
    
    React.useEffect(() => {
        const canvas = canvasRef.current
        const context = canvas.getContext('2d')
        let frameCount = 50
        let animationFrameId
        
        const render = () => {
          frameCount++
          draw(context, canvas, frameCount)
          animationFrameId = window.requestAnimationFrame(render)
        }
        render()
        
        return () => {
          window.cancelAnimationFrame(animationFrameId)
        }
    }, [draw])
      
    return canvasRef
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