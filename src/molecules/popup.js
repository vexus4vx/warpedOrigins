import React from "react";
import { Box, Button, Divider, Modal, TextField, Typography } from "@mui/material";
import { ModalOverflow } from '@mui/joy';

// import Button from '@mui/joy/Button';
// import Modal from '@mui/joy/Modal';
import ModalClose from '@mui/joy/ModalClose';
import ModalDialog from '@mui/joy/ModalDialog';
// import Typography from '@mui/joy/Typography';

import NumericInput from "../atoms/numericInput";

export default function BasicModal({showModal, buttonText, text, dataSet, onClose, onSubmit, onClick}) {
    const [open, setOpen] = React.useState(false); 
    const [datasetChanges, setDataSetChanges] = React.useState([]);
    const handleClose = () => {
        onClose()
        setDataSetChanges([])
    }
    const handleSubmit = () => onSubmit(datasetChanges)

    React.useEffect(() => {
        setOpen(showModal)
        setDataSetChanges([])
    }, [showModal])

    const onUpdateDataSet = ({val, k}) => {
        let arr = [...datasetChanges]
        if(arr.length >= (k + 1)) arr[k] = Number(val) || 0
        else {
            while(arr.length < (k + 1)) arr.push(0)
            arr[k] = Number(val) || 0
        }
        setDataSetChanges(arr)
    }
  
    return (
      <div>
        <Button onClick={() => onClick()}>{buttonText}</Button>
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <ModalOverflow>
                <ModalDialog aria-labelledby="modal-dialog-overflow" layout={'center'}>
                    <ModalClose onClick={handleClose} />
                    <Typography sx={{textAlign: 'center'}} variant="h6" component="h2">{text}</Typography>
                    <Divider />
                    <ShowDataSet dataSet={dataSet} onChange={onUpdateDataSet}/>
                    <Button onClick={() => datasetChanges.length === dataSet?.length ? handleSubmit() : null}>Submit</Button>
                </ModalDialog>
            </ModalOverflow>
        </Modal>
      </div>
    );
}

function ShowDataSet({dataSet, onChange}){
    if(!dataSet || typeof dataSet !== 'object') return null

    return <Box sx={styles.dataSet}>
        {dataSet.map((v, k) => (
            <Box sx={styles.innerSet} key={k}>
                <TextField label='predicted' disabled value={v} />
                <Divider />
                <NumericInput label='adjust' onChange={(val) => onChange({val, k})} />
            </Box>
        ))}
    </Box>
}

const styles = {
    main: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4
    },
    dataSet: {
        display: 'flex',
        flexDirection: 'column'
    },
    innerSet: {
        display: 'flex',
        flexDirection: 'row',
        justifycontent: 'space-around',
        margin: 2
    }
};