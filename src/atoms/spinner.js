import { ClipLoader, CircleLoader, RingLoader, MoonLoader } from "react-spinners";
import { Box } from "@mui/material";

// refactor
export default function Spinner({color = 'red', loading = true, size = 150, width = 200, ...props}) {
    return <RingLoader
        color={color}
        loading={loading}
        cssOverride={{
            display: "block",
            margin: "0 auto",
            borderColor: "green",
        }}
        size={size}
        aria-label="Loading Spinner"
        data-testid="loader"
        width={width}
        {...props}
    />
}

export const DefaultSpinner = (key) => <Box key={key} sx={{
    display: 'flex',
    justifyContent: 'center',
    width: '90%',
    top: '25%',
    position: 'fixed',
    overflow: 'visible',
    height: 0
}}>
    <Spinner size={300} speedMultiplier={0.7} color={'black'}/>
</Box>