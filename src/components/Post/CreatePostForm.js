import { Fragment, useContext, useState } from 'react';

import { PostContext } from '../../store/post-context';
import { ModalContext } from '../../store/modal-context';
import { auth } from '../../firebase/firebase';
import Button from '../UI/Button';
import CloseButton from '../UI/CloseButton';
import LoadingSpinner from '../UI/LoadingSpinner';
import classes from './CreatePostForm.module.css';
import ErrorMessage from '../UI/ErrorMessage';

const CreatePostForm = () => {
    const [file, setFile] = useState(null);
    const [caption, setCaption] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const { postCtx } = useContext(PostContext);
    const { modalCtx } = useContext(ModalContext);
    const userId = auth.currentUser.uid;

    const enteredFile = (event) => {
        setFile(event.target.files[0]);
    };

    const enteredCaption = (event) => {
        setCaption(event.target.value);
    };

    const validateForm = () => {
        let isValid = true;
        setError('');

        if (!file) {
            isValid = false;
            setError('Please select an image to upload');
            setIsLoading(false);
        };

        return isValid;
    };

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        setIsLoading(true);
    
        if (validateForm()) {
            await postCtx.createPost(file, caption, userId);
            setIsLoading(false);
        };
    };

    return (
        <Fragment>
            <header className={classes.header}>
                <h2>Make a post</h2>
                <CloseButton onClick={modalCtx.modalHandler} />
            </header>
            <form
                className={classes.form} 
                onSubmit={onSubmitHandler}
            >
                <input 
                    type='file' 
                    name='file' 
                    accept='image/png, image/jpeg' 
                    onChange={enteredFile}
                />
                <textarea 
                    name='caption' 
                    placeholder='Write a caption...' 
                    value={caption}
                    onChange={enteredCaption}
                />
                {!isLoading &&
                    <Button>Post</Button>
                }
                {error && 
                    <ErrorMessage message={error} />
                }
                {isLoading &&
                    <LoadingSpinner />
                }
            </form>
        </Fragment>
    );
};

export default CreatePostForm;