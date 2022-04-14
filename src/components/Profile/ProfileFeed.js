import { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';

import { doc, getDoc, collection, gtDocs, getDocs } from 'firebase/firestore';
import { firestoreDB } from '../../firebase/firebase';

import { UserContext } from '../../store/user-context';
import SimplePost from '../Post/SimplePost';
import classes from './ProfileFeed.module.css';

const ProfileFeed = () => {
    const [posts, setPosts] = useState([]);
    const {userCtx} = useContext(UserContext);
    const currentUser = userCtx.user;
    const {userId} = useParams();

    useEffect(() => {
        const getPosts = async () => {
            setPosts([]);
            const querySnapshot = await getDocs(collection(firestoreDB, `users/${userId}/posts`));
            querySnapshot.forEach((doc) => {
                setPosts(prevState => ([
                    ...prevState,
                    doc.data()
                ]));
            });

            // const docRef = doc(firestoreDB, 'posts', currentUser.userId);
            // const docSnapshot = await getDoc(docRef);

            // if (docSnapshot.exists()) {
            //     console.log(docSnapshot.data());
            //     setPosts(docSnapshot.data());
            // } else {
            //     console.log('Posts not found');
            // };
        };

        getPosts();
    }, [userId]);

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