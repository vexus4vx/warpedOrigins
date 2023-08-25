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