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

    function handleChange(e) {
        const url = URL.createObjectURL(e.target.files[0])

        if(setParams){
            const img = new Image();
            img.src = url;

            img.onload = () => {
                setParams({height: img.height, width : img.width, url});
            };
        }
        setFile(url);
    }

    function handleUrlChange(e) {
        // lets add some security at some point ...
        if(setParams){
            const img = new Image();
            img.src = e.target.value;

            img.onload = () => {
                setParams({height: img.height, width : img.width, url: img.src});
            };
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
        </div>
    );
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