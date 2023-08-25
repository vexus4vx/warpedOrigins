export function saveFileData(userInfo, name) {
    const fileData = JSON.stringify(userInfo);
    const blob = new Blob([fileData], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = `${name}.json`;
    link.href = url;
    link.click();
}

export function fetchFileData(){
   return <input type="file" id="file-selector" accept=".json, .txt"></input>
}


export function readFileData(){
    const showFile = (e) => {
        e.preventDefault();
        const reader = new FileReader();
        reader.onload = (e) => {
          const text = e.target.result;
          console.log(text);
        };
        reader.readAsText(e.target.files[0]);
    };
    
    return (
        <div>
          <input type="file" onChange={showFile} />
        </div>
    );
}


/**
 * try where relevant
    import raw from '../constants/foo.txt';
    fetch(raw)
    .then(r => r.text())
    .then(text => {
    console.log('text decoded:', text);
    });
*/