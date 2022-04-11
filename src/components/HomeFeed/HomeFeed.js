import { useEffect, useState } from 'react';
import { getCollection } from '../../firebase/firebase';

import Post from '../Post/Post';
import classes from './HomeFeed.module.css';

const HomeFeed = () => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const getPosts = async () => {
            const posts = await getCollection('posts');
            setPosts(posts);
        };

        getPosts();
    }, []);

    useEffect(() => {
        console.log(posts);
    }, [posts]);

    return (
        <div className={classes['home-feed']}>
            {posts.map(post => (
                <Post
                    key={post.postId}
                    userId={post.userId}
                    username={post.username}
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