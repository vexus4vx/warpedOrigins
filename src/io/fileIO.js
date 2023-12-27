import React from "react";

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

    return (
        <div style={{display: "flex", flexDirection: 'column'}}>
            <h2>Add Image:</h2>
            <input type="file" onChange={handleChange} />
            <img style={{height: 350, width: 400, ...imgStyle}} src={file} />
        </div>
    );
}