import { useContext, useEffect, useState } from 'react';

import { ref, getDownloadURL } from 'firebase/storage';
import { storage } from '../../firebase/firebase';

import { ModalContext } from '../../store/modal-context';
import Post from './Post';
import PostPlaceholder from './PostPlaceholder';
import classes from './SimplePost.module.css';

const SimplePost = ({ userId, postId, imageId, username, likes, caption, comments }) => {
    const [imageUrl, setImageUrl] = useState(null);
    const { modalCtx } = useContext(ModalContext);

    useEffect(() => {
        const fetchImage = async () => {
            await getDownloadURL(ref(storage, `posts/${imageId}/`))
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
        modalCtx.modalHandler(
            <Post 
                userId={userId}
                postId={postId}
                username={username}
                likes={likes}
                caption={caption}
                comments={comments}
                inModal={true}
            />
        );
    };

    return (
        <div className={classes.post} onClick={openInModal}>
            {imageUrl &&
                <img src={imageUrl} alt='Post' />
            }
            {!imageUrl &&
                <PostPlaceholder />
            }
        </div>
    );
};

export default SimplePost;