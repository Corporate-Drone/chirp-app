import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import ErrorIcon from '@material-ui/icons/Error';
import CloseIcon from '@material-ui/icons/Close';
import './ErrorModal.css'

function rand() {
    return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
    const top = 50;
    const left = 50;

    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`,
    };
}

const useStyles = makeStyles((theme) => ({
    paper: {
        position: 'absolute',
        width: 400,
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
}));

export default function ErrorModal(props) {
    const { message, setDisplayError } = props;
    const classes = useStyles();
    // getModalStyle is not a pure function, we roll the style only on the first render
    const [modalStyle] = React.useState(getModalStyle);
    const [open, setOpen] = React.useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        //reset error message state
        setDisplayError(undefined)
    };

    const body = (
        <div style={modalStyle} className={classes.paper} id="ErrorModal-container">
            <button className="ErrorModal-close" onClick={handleClose}><CloseIcon /></button>
            <ErrorIcon className="ErrorIcon" /> 
            <h2 id="simple-modal-title">Error</h2>
            <p id="simple-modal-description">
                {message}
            </p>

        </div>
    );

    //open Modal if error exists
    useEffect(() => {
        handleOpen();
    }, [])


    return (
        <div>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
            >
                {body}
            </Modal>
        </div>
    );
}