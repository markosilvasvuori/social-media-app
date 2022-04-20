import { useNavigate } from 'react-router-dom';

import classes from './BackButton.module.css';

const BackButton = () => { 
    const navigate = useNavigate();

    return (
        <button 
            className={classes['back-button']} 
            onClick={() => navigate(-1)}
        >
            <span></span>
            <span></span>
        </button>
    );
};

export default BackButton;