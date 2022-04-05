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

    return (
        <div className={classes['home-feed']}>
            {posts.map(post => (
                <Post
                    username={post.username}
                    imageUrl={post.imageUrl}
                    likes={post.likes}
                    capiton={post.caption}
                    comments={post.comments}
                />
            ))}
        </div>
    );
};

export default HomeFeed;