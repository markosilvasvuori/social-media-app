import { createContext, useState } from 'react';

export const ModalContext = createContext('');

export const ModalProvider = (props) => {
    const [modal, setModal] = useState(false);
    const [modalContent, setModalContent] = useState(null);

    const modalHandler = (content, handleVisibility = true) => {
        if (handleVisibility) {
            setModal(!modal);
        }
        if (content) {
            setModalContent(content);
        };
    };

    const modalCtx = {
        modalHandler: modalHandler,
        modal: modal,
        modalContent: modalContent,
    };
    
    return (
        <ModalContext.Provider value={{modalCtx}}>
            {props.children}
        </ModalContext.Provider>
    );
};