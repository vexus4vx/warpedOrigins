import React from "react";

import { LoadFile, saveFileData } from "../../io/fileIO";
import TopMenu from "../../molecules/topMenu";
import { GeneralButton } from "../../atoms/button";
import { artStore } from "./store";

export function Interface() {
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

export function ImageDisplay({url}) {
    const draw = ((ctx, frameCount) => {
        let img = new Image();
        img.src = url;

        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.drawImage(img,0,0);
        
    })

    return <div style={{marginTop: 50}}>
        Resulting image
        <div style={{marginTop: 40, height: 350, width: 400, ...styles.framedBorder}}>
            {url ? <Canvas draw={draw} /> : null}
        </div>
    </div>
}

export function ImageHandling() {
    const [url, setUrl] = React.useState();
    const setState = artStore(state => state.setState);

    return <div style={styles.main}>
        <TopMenu/>
        <div style={styles.inner}>
            <LoadFile setParams={(obj) => {setState(obj); setUrl(obj.url)}} imgStyle={styles.framedBorder} />
            <Interface imgStyle={styles.framedBorder} />
            <ImageDisplay url={url} />
        </div>
    </div>
}

export function Canvas({draw = () => {}, ...rest}){
    const canvasRef = useCanvas(draw);

  return <canvas ref={canvasRef} {...rest}/>
}

// Hook
const useCanvas = (draw) => {
    const canvasRef = React.useRef(null)
    
    React.useEffect(() => {
        const canvas = canvasRef.current
        const context = canvas.getContext('2d')
        let frameCount = 0
        let animationFrameId
        
        const render = () => {
          frameCount++
          draw(context, frameCount)
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