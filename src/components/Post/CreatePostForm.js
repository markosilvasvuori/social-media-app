import { Fragment, useContext, useState } from 'react';

import { PostContext } from '../../store/post-context';
import { ModalContext } from '../../store/modal-context';
import { auth } from '../../firebase/firebase';
import Button from '../UI/Button';
import classes from './CreatePostForm.module.css';
import CloseButton from '../UI/CloseButton';

const CreatePostForm = () => {
    const [file, setFile] = useState(null);
    const [caption, setCaption] = useState('');
    const { postCtx } = useContext(PostContext);
    const { modalCtx } = useContext(ModalContext);
    const userId = auth.currentUser.uid;

    const enteredFile = (event) => {
        setFile(event.target.files[0]);
    };

    const enteredCaption = (event) => {
        setCaption(event.target.value);
    };

    const onSubmitHandler = (event) => {
        event.preventDefault();
    
        postCtx.createPost(file, caption, userId);
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
                <Button>Post</Button>
            </form>
        </Fragment>
    );
};

export default CreatePostForm;