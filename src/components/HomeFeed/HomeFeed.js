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
        if (auth.currentUser.uid) {
            const userDataSnapshot = onSnapshot(doc(firestoreDB, 'users', currentUserId), (doc) => {
                setFollowedUsers(doc.data().following);
            });
        }
    }, []);

    useEffect(() => {
        const postsArray = [];

        const getPosts = async () => {
            let ownPostAddedToFeed = false;
            const usersSnapshot = await getDocs(collection(firestoreDB, 'users'));

            // If user follows other users, query only followed users
            if (followedUsers.length !== 0) {
                followedUsers.map((followedUser) => {
                    usersSnapshot.docs.map((doc) => {
                        const user = doc.data();
                        if (user.userId === followedUser || (user.userId === currentUserId && !ownPostAddedToFeed)) {
                            const post = doc.data().posts[doc.data().posts.length - 1];
                            if (post) {
                                postsArray.push(post);
                            }
                            
                            if (user.userId === currentUserId && !ownPostAddedToFeed) {
                                ownPostAddedToFeed = true;
                            }
                        };
                    });
                });
            };

            // If user does not follow anyone, query posts from all users
            if (followedUsers.length === 0) {
                usersSnapshot.docs.map((doc) => {
                    const user = doc.data();
                    if (user.posts.length) {
                        const post = user.posts[user.posts.length - 1];
                        postsArray.push(post);
                    }
                });
            };
            
            postsArray.sort((a, b) => {
                return b.timestamp.localeCompare(a.timestamp);
            })

            setPosts(postsArray);
        };

        getPosts();
    }, [followedUsers]);

    return (
        <div className={classes['home-feed']}>
            {followedUsers.length === 0 &&
                <div className={classes.message}>
                    <p>Showing posts from all users.</p>
                    <p>Follow someone to see posts only from followed users!</p>
                </div>
            }
            {posts.map(post => (
                <Post
                    key={post.postId}
                    userId={post.userId}
                    profilePicture={post.profilePicture}
                    postId={post.postId}
                    likes={post.likes}
                    caption={post.caption}
                    comments={post.comments}
                />
            ))}
        </div>
    );
};

export default HomeFeed;