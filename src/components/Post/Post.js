const Post = ({ username, imageUrl, likes, caption, comments }) => {
    return (
        <div className={classes.post}>
            <header>
                <div className={classes.user}>
                    <img src='' alt='' />
                    <p className={classes.bold}>{username}</p>
                </div>
                <button>...</button>
            </header>
            <div className={classes.content}>
                <img src={imageUrl} alt='post' />
            </div>
            <div className={classes.bottom}>
                <section className={classes.buttons}>
                    <button>Like</button>
                    <button>Comment</button>
                </section>
                <section>
                    <div className={classes.bold}>
                        {likes} likes
                    </div>
                </section>
                <section>
                    <p>
                        <a className={classes.bold} href='#'>{username} </a>
                        {caption}
                    </p>
                </section>
                <a className={classes.comments} href='#'>
                    Show all {comments.length} comments
                </a>
            </div>
        </div>
    );
};

export default Post;