import { Box } from '@mui/material';
import { primary } from '../constants';


/**
 * 
 * @returns a box with some text
 */
export default function TextComponent({style, ...props}) {

    return  (
        <Box sx={styles.main(style)}>
            <Box sx={styles.heading(props?.maxWidth)}>{props?.heading}</Box>
            <Box sx={styles.body(props?.maxWidth)}>{props?.body}</Box>
            {props?.controlls}
        </Box>
    );
}


const styles = {
    main : (style) => {
        let obj = {
            display: 'flex',
            flexDirection: 'column',
            justifyCotent: 'space-around',
            color: primary(),
            fontWeight:'bold',
            margin: 2,
            textAlign: 'center'
        }

        return typeof style === "object" ? {...obj, ...style} : obj
    },
    heading: (maxWidth) => {
        return{
            marginBottom: 1,
            maxWidth: maxWidth || 400,
            fontSize: 20
        }
    },
    body: (maxWidth) => {
        return{
            margin: 1,
            maxWidth: maxWidth || 400
        }
    }
}