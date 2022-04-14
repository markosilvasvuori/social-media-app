import { useEffect, useState } from 'react';

import { ref, getDownloadURL } from 'firebase/storage';
import { storage } from '../../firebase/firebase';

import classes from './SimplePost.module.css';

const SimplePost = ({ userId, imageId, username, profilePicture, likes, caption, comments }) => {
    const [imageUrl, setImageUrl] = useState(null);

    useEffect(() => {
        const fetchImage = async () => {
            await getDownloadURL(ref(storage, `posts/${userId}/${imageId}`))
            .then((url) => {
                setImageUrl(url);
            })
            .catch((error) => {
                console.log(error.code);
                console.log(error.message);
            });
        };

        fetchImage();
    }, []);  
    
    const openInModal = () => {
        console.log('open in modal');
    };

    return (
        <div className={classes.post} onClick={openInModal}>
            <img src={imageUrl} alt='Post' />
        </div>
    );
};

export default SimplePost;