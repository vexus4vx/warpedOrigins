import { create } from 'zustand';
import { ModObject } from './ImageMod';

// lets add this just in case 
export const artStore = create(set => ({
    setState: (obj) => {
        set(state => ({...obj}));
    },
    setImg: ({url, width, height}) => {
        console.log(url, '...')

        if(url){
            const img = new Image();
            img.src = url;

            set(state => {return {url, width, height}})

            set(state => {
                state.handleOffscreenCanvas();
                return {}
            })
        }
    },
    setWebImg: (obj) => { // not working atm // rem
        if(obj.url){
            console.log('setWebImg')
            set(state => {
                const img = new Image();
                img.src = obj.url;
                
                // Get the remote image as a Blob with the fetch API
                fetch(img.src, {headers: {'mode':'no-cors'}, mode:'no-cors'})
                    .then((res) => res.blob())
                    .then((blob) => {
                        // Read the Blob as DataURL using the FileReader API
                        const reader = new FileReader();
                        reader.onloadend = () => {
                            console.log(reader.result);
                            // Logs data:image/jpeg;base64,wL2dvYWwgbW9yZ...
            
                            // Convert to Base64 string
                            console.log('?',{dataUrl: reader.result})

                            const base64 = getBase64StringFromDataURL(reader.result);
                            console.log({base64});
                            // Logs wL2dvYWwgbW9yZ...
                        };
                        reader.readAsDataURL(blob);
                        console.log(blob)
                });
                
                return {pixelDataArray: img.dataArray}
            })
            set(state => {
                if(!state.offScreenCanvas) state.createOffscreenCanvas();
                else state.updateCanvas();
                return {}
            })
        }
    },
    mods: [],
    addMod: (v) => {
        set(state => {
            return {mods: [...state.mods, v]}
        })
        
        set(state => {
            if(state.offScreenCanvas) state.updateCanvas();
            return {}
        })
    },
    removeMod: (i) => {
        set(state => {
            let out = [];
            state.mods.forEach((v, j) => {
                if(i !== j)out.push(v);
            })
            return {mods: out};
        })

        set(state => {
            if(state.offScreenCanvas) state.updateCanvas();
            return {}
        })
    },
    originalPixelData: [],
    modifiedPixelData: [],
    handleOffscreenCanvas: () => {
        let width, height, pixelDataArray, url, osc, ctx;
        set(state => {
            width = state.width;
            height = state.height;
            pixelDataArray = state.pixelDataArray;
            url = state.url;
            osc = state.offScreenCanvas;
            ctx = state.context;
            return {};
        })

        console.log(width , height , pixelDataArray, url) // rem

        if(width && height && url){
            let offScreenCanvas = osc || document.createElement('canvas');
            offScreenCanvas.width = width;
            offScreenCanvas.height = height;
            let context = ctx || offScreenCanvas.getContext("2d");

            let img = new Image();
            img.src = url;
            
            context.drawImage(img,0,0);
            const dataURL = offScreenCanvas.toDataURL(); // same ?
            const imageData = context.getImageData(0, 0, width, height).data;

            set(state => {
                return {offScreenCanvas, context, originalPixelData: imageData, dataURL}
            })
        }
    },
    updateCanvas: () => { // fix ...
        // check relevant mods ...

        let width, height, mods, ctx, originalPixelData;
        set(state => {
            width = state.width;
            height = state.height;
            mods = state.mods;
            ctx = state.context;
            originalPixelData = state.originalPixelData;
            return {};
        })

        // this should just putImageData after applying the mods to the originalPixelData
        let imageData = originalPixelData;

        // what we really need to do here is map over the 
        mods.forEach(funct => { // not efficient
            ModObject[funct](imageData, width, height);
        })
        
        set(state => {
            state.context.putImageData(new ImageData(mods.length ? imageData : originalPixelData, width, height), 0, 0);
            const dataURL = state.offScreenCanvas.toDataURL()
            return {dataURL}
        })
    }
}));

const getBase64StringFromDataURL = (dataURL) => dataURL.replace('data:', '').replace(/^.+,/, '');