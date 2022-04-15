import { Fragment, useContext } from 'react';
import ReactDOM from 'react-dom';

import { ModalContext } from '../../store/modal-context';
import classes from './Modal.module.css';

export const Backdrop = (props) => {
    return (
        <div 
            className={classes.backdrop}
            onClick={props.onClick}
        >
        </div>
    );
};

const Modal = () => {
    const { modalCtx } = useContext(ModalContext);

    const closeModal = () => {
        modalCtx.modalHandler();    
    }

    return ReactDOM.createPortal(
        <Fragment>
            <Backdrop onClick={closeModal} />
            <div className={classes.modal}>
                {modalCtx.modalContent}
            </div>
        </Fragment>,
        document.querySelector('#modal-root')
    );
};

export default Modal;