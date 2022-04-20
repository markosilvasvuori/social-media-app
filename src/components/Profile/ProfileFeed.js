import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { firestoreDB } from '../../firebase/firebase';

import SimplePost from '../Post/SimplePost';
import classes from './ProfileFeed.module.css';

const ProfileFeed = () => {
    const [posts, setPosts] = useState([]);
    const [postsLength, setPostsLength] = useState(null);
    const { userId } = useParams();

    useEffect(() => {
        const postsSnapshot = onSnapshot(doc(firestoreDB, 'users', userId), (doc) => {
            setPostsLength(doc.data().posts.length);
        });
    }, []);

    useEffect(() => {
        const getPosts = async () => {
            const userRef = doc(firestoreDB, 'users', userId);
            const userSnapshot = await getDoc(userRef);

            if (userSnapshot.exists()) {
                const reversedArray = [...userSnapshot.data().posts].reverse();
                setPosts(reversedArray);
            }
        };

        getPosts();
    }, [userId, postsLength]);

    // useEffect(() => console.log(posts), [posts]);

    return (
        <div className={classes['profile-feed']}>
            {posts.map(post => (
                <SimplePost
                    key={post.postId}
                    userId={post.userId}
                    username={post.username}
                    profilePicture={post.profilePicture}
                    imageId={post.postId}
                    likes={post.likes}
                    caption={post.caption}
                    comments={post.comments}
                />
            ))}
        </div>
    );
};

export default ProfileFeed;