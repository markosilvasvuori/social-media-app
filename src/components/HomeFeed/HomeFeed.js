import { useEffect, useState } from 'react';
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
            const usersSnapshot = await getDocs(collection(firestoreDB, 'users'));

            // If user follows other users, query only followed users
            if (followedUsers.length !== 0) {
                followedUsers.map((followedUser) => {
                    usersSnapshot.docs.map((doc) => {
                        if (doc.data().userId === followedUser) {
                            postsArray.push(doc.data().posts[0]);
                        };
                    });
                });
            };;

            // If user does not follow anyone, query posts from all users
            if (followedUsers.length === 0) {
                usersSnapshot.docs.map((doc) => {
                    postsArray.push(doc.data().posts[0]);
                });
            };

            setPosts(postsArray);
        };

        getPosts();
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