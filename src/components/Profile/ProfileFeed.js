import { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';

import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { firestoreDB } from '../../firebase/firebase';

import SimplePost from '../Post/SimplePost';
import classes from './ProfileFeed.module.css';

const ProfileFeed = () => {
    const [posts, setPosts] = useState([]);
    const {userId} = useParams();

    useEffect(() => {
        // const getPosts = async () => {
        //     setPosts([]);
        //     const querySnapshot = await getDocs(collection(firestoreDB, `users/${userId}/posts`));
        //     querySnapshot.forEach((doc) => {
        //         setPosts(prevState => ([
        //             ...prevState,
        //             doc.data()
        //         ]));
        //     });
        // };

        const getPosts = async () => {
            const userRef = doc(firestoreDB, 'users', userId);
            const userSnapshot = await getDoc(userRef);

            if (userSnapshot.exists()) {
                setPosts(userSnapshot.data().posts);
            }
        };

        getPosts();
    }, [userId]);

    useEffect(() => console.log(posts), [posts])

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