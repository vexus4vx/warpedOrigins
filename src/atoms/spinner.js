import { ClipLoader, CircleLoader, RingLoader, MoonLoader } from "react-spinners";

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