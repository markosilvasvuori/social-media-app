import classes from './HomeFeed.module.css';

const DUMMY_POSTS = [
    {
        username: 'John Doe',
        imageUrl: 'url',
        caption: 'This is a test post and the first post at the same time',
        likes: 10,
        comments: [
            {username: 'JaneDoe', comment: 'Nice photo!'},
            {username: 'Tester', comment: 'Hello John'},
        ]
    },
    {
        username: 'Jane Doe',
        imageUrl: 'url',
        caption: 'This is a second post',
        likes: 12,
        comments: [
            {username: 'JohnDoe', comment: 'Hi!'},
            {username: 'Tester', comment: 'Hello'},
        ]
    }
]

const HomeFeed = () => {
    return (
        <div className={classes['home-feed']}>
            {DUMMY_POSTS.map(post => (
                <div>
                    <header>
                        <div>
                            <img src='' alt='' />
                            <p>{post.username}</p>
                        </div>
                        <button>...</button>
                    </header>
                    <div>
                        <img src={post.imageUrl} alt='post' />
                    </div>
                    <div>
                        <section>
                            <button>Like</button>
                            <button>Comment</button>
                        </section>
                        <section>{post.likes} likes</section>
                        <section>{post.caption}</section>
                        <a href='/'>Show all {post.comments.length} comments</a>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default HomeFeed;