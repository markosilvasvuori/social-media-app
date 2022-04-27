import { Fragment, useContext } from 'react';
import ReactDOM from 'react-dom';

import { MenuModalContext } from '../../../store/menu-modal-context';
import classes from './MenuModal.module.css';

export const Backdrop = (props) => {
    return (
        <div 
            className={classes.backdrop}
            onClick={props.onClick}
        >
        </div>
    );
};

const Menu = () => {
    const { menuModalCtx } = useContext(MenuModalContext);

    const closeMenuHandler = () => {
        menuModalCtx.menuHandler();
    };

    return ReactDOM.createPortal(
        <Fragment>
            <Backdrop onClick={closeMenuHandler} />
            <div className={classes.modal}>
                {menuModalCtx.menuContent}
            </div>
        </Fragment>,
        document.querySelector('#menu-root')
    );
};

export default Menu;