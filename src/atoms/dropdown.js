import React from "react";
import { MenuItem, Select } from "@mui/material";

/**
 * 
 * @param {Object} obj {unitId: unitName, ...}
 * @param {Function} onChange ...
 * @param {String} init unitId
 * @returns 
 */
export default function Dropdown({obj = {}, onChange = () => null, init = ''}) {
    const [value, setValue] = React.useState(init);

    React.useEffect(() => {
        setValue(init);
    }, [init])

    return <Select
        value={value}
        label="Select Units"
        onChange={(e) => {
            setValue(e.target.value);
            onChange(e.target.value);
        }}
        style={{width: '200px'}}
    >
        {Object.keys(obj).map((key, i) => <MenuItem key={i} value={key}>{obj[key]}</MenuItem>)}
    </Select>
}