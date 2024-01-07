import {ExitButton} from "../atoms/button";
import useStore from "../store";

export default function TopMenu({style, ...props}) {
    const setLandingMenuSelection = useStore(state => state.setLandingMenuSelection);

    return <div style={{...styles.main, ...style}}>
        <ExitButton onClick={() => setLandingMenuSelection(-1)} />
    </div>
}

const styles = {
    main: {
        height: 30,
        display: 'flex',
        justifyContent: 'flex-end',
        border: 'solid',
        borderColor: 'gray',
        padding: 5,
        borderRadius: 4
    }
}