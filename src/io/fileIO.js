import React from "react";
import { TextField, Checkbox } from "@mui/material";

export function saveFileData(userInfo, name, mimetype = '.json') {
    const fileData = JSON.stringify(userInfo);
    const blob = new Blob([fileData], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = `${name}${mimetype}`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url); 
}

export function ReadFileData({set, mimeType = ".json, .txt, .png"}){
    const showFile = (e) => {
        e.preventDefault();
        const reader = new FileReader();
        reader.onload = (e) => {
          const text = e.target.result;
          set(text);
        };
        reader.readAsText(e.target.files[0]);
    };
    
    return <input type="file" accept={mimeType} onChange={showFile} />
}

export function LoadFile({setParams, imgStyle = {}}) {
    const [file, setFile] = React.useState();
    const [checked, setChecked] = React.useState(false);

    const [uri, setUri] = React.useState()

    function handleChange(e) {
        if(!e || !e.target || !e.target.files || !e.target.files[0]) return null;
        
        const url = URL.createObjectURL(e.target.files[0]);

        if(setParams){
            const img = new Image();
            img.src = url;

            img.onload = () => {
                setParams({height: img.height, width : img.width, url}, checked); // rm ckd
            };
        }
        setFile(url);
    }

    function handleUrlChange(e) {
        // lets add some security at some point ...
        if(setParams){
            const img = new Image();
            img.src = e.target.value;

            fetchBlob(img.src, (url) => {
                //img.onload = () => {
                    img.src = url
                    setParams({height: img.height, width : img.width, url}, checked); // rem chkd
                    console.log({url})
                    setUri(url);
                //};
            })

            /*img.onload = () => {
                setParams({height: img.height, width : img.width, url: img.src}, 1);
            }; */
        }
        setFile(e.target.value);
    }

    function handleCheck(e) {
        setChecked(e.target.checked);
        setFile(null);
        setParams(null);
    }

    return (
        <div style={{display: "flex", flexDirection: 'column'}}>
            <div style={{display: 'flex'}}>
                <h2>Add {checked ? 'Web Image' : 'Image from File'} :</h2>
                <Checkbox checked={checked} onChange={handleCheck} />
            </div>
            {checked ? <TextField onChange={handleUrlChange} sx={styles.textField} id="outlined-basic" label="Image Url" variant="outlined" /> : <input type="file" onChange={handleChange} />}
            <img style={{height: 350, width: 400, ...imgStyle}} src={file} />
            <img style={{height: 350, width: 400, ...imgStyle}} src={uri} />
        </div>
    );
}


function fetchBlob(url, thenDo) {
    // Use fetch to fetch the image, and convert the resulting response to a blob
    // Again, if any errors occur we report them in the console.
    fetch(url, {headers: {'mode':'no-cors'}, mode:'no-cors'}).then(function(response) {
        console.log(response)
        return response.blob();
    }).then(function(blob) {
        console.log({blob})
      // Convert the blob to an object URL — this is basically an temporary internal URL
      // that points to an object stored inside the browser
      let objectURL = URL.createObjectURL(blob);
      // invoke showProduct
      thenDo(objectURL);
    });
  }

const styles = {
    textField: {
        marginBottom: 2,
        backgroundColor: '#f0f0f0',
        border: 'solid',
        borderWidth: 5,
        borderRadius: 2
    }
}