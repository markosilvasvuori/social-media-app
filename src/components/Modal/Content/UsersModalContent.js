import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";

import { doc, getDoc } from "firebase/firestore";
import { firestoreDB } from "../../../firebase/firebase";

import { UserContext } from "../../../store/user-context";
import { ModalContext } from "../../../store/modal-context";
import ProfilePicture from "../../UI/ProfilePicture";
import Button from "../../UI/Button";
import classes from './UsersModalContent.module.css';
import CloseButton from "../../UI/CloseButton";

const UsersModalContent = ({ users, username, category }) => {
    const [usersCollection, setUsersCollection] = useState([]);
    const {userCtx} = useContext(UserContext);
    const currentUser = userCtx.user;
    const {modalCtx} = useContext(ModalContext);

    useEffect(() => {
        const getUsers = () => {
            users.map(async (user) => {
                const userRef = doc(firestoreDB, 'users', user);
                const userSnapshot = await getDoc(userRef);

                if (userSnapshot.exists()) {
                    setUsersCollection(prevState => [
                        ...prevState,
                        userSnapshot.data()
                    ]);
                };
            });
        };

        getUsers();
    }, [users]);

    return (
        <div className={classes['modal-content']}>
            <header>
                <h2>{username}</h2>
                <p>{category}</p>
                <CloseButton
                    onClick={modalCtx.modalHandler}
                />
            </header>
            <ul>
                {usersCollection.map((user) => (
                    <li key={user.userId}>
                        <div className={classes.user}>
                            <ProfilePicture
                                userId={user.userId}
                                size={'small'}
                            />
                            <div className={classes.name}>
                                <Link 
                                    to={`profile/${user.userId}`}
                                    onClick={modalCtx.modalHandler}
                                >
                                    <span>{user.username}</span>
                                    <span>{user.name}</span>
                                </Link>
                            </div>
                        </div>
                        {user.userId !== currentUser.userId &&
                            <div className={classes.button}>
                                {!currentUser.following.includes(user.userId) &&
                                    <Button 
                                        onClick={() => userCtx.follow(user.userId)}
                                    >
                                        Follow
                                    </Button>
                                }
                                {currentUser.following.includes(user.userId) &&
                                    <Button 
                                        onClick={() => userCtx.unfollow(user.userId)}
                                    >
                                        Unfollow
                                    </Button>
                                }
                            </div>
                        }
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default UsersModalContent;