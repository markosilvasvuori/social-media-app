import { useEffect, useState, useContext } from 'react';
import { getCollection } from '../../firebase/firebase';
import { auth, firestoreDB } from '../../firebase/firebase';
import { collection, doc, getDocs, onSnapshot } from 'firebase/firestore';

import Post from '../Post/Post';
import classes from './HomeFeed.module.css';

const HomeFeed = () => {
    const [posts, setPosts] = useState([]);
    const [followedUsers, setFollowedUsers] = useState([]);
    const currentUserId = auth.currentUser.uid;

    useEffect(() => {
        const userDataSnapshot = onSnapshot(doc(firestoreDB, 'users', currentUserId), (doc) => {
            setFollowedUsers(doc.data().following);
        });
    }, []);

    useEffect(() => {
        const postsArray = [];
        const getPosts = async () => {
            const querySnapshot = await getDocs(collection(firestoreDB, 'users'));
            querySnapshot.docs.map(async (doc, i) => {
                const userQuery = followedUsers.length !== 0 ? followedUsers[i] : doc.id;
                console.log('userQuery: ' + userQuery);
                const posts = await getDocs(collection(firestoreDB, `users/${userQuery}/posts`));
                posts.docs.map((post) => {
                    postsArray.push(post.data());
                });
                setPosts(postsArray);
            });
        };

        getPosts();

        // const getPosts = async () => {
        //     const posts = await getCollection('posts');
        //     setPosts(posts);
        // };

        // getPosts();
    }, [followedUsers]);

    return (
        <div className={classes['home-feed']}>
            {posts.map(post => (
                <Post
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

export default HomeFeed;