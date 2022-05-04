import { collection, getDocs, query, where } from 'firebase/firestore';
import { Fragment, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { firestoreDB } from '../../firebase/firebase';

import searchIcon from '../../images/search.svg';
import LoadingSpinner from '../UI/LoadingSpinner';
import ProfilePicture from '../UI/ProfilePicture';
import classes from './Search.module.css';

export const Backdrop = (props) => {
    return (
        <div 
            className={classes.backdrop}
            onClick={props.onClick}
        >
        </div>
    );
};

const Search = ({ onSearch }) => {
    const [isSearching, setIsSearching] = useState(false);
    const [enteredSearch, setEnteredSearch] = useState('');
    const [noResults, setNoResults] = useState(false);
    const [searchResults, setSearchResults] = useState([]);

    const enteredSearchHandler = (event) => {
        setEnteredSearch(event.target.value);
    };

    const isSearchingHandler = () => {
        setSearchResults([]);
        setEnteredSearch('');
        onSearch();
        setIsSearching(!isSearching);
    };

    useEffect(() => {
        setSearchResults([]);
        setNoResults(false);
        
        const searchUsers = async () => {
            const usersRef = collection(firestoreDB, 'users');
            const usersQuery = query(usersRef, where('username', '>=', enteredSearch.toLowerCase()));

            const usersQuerySnapshot = await getDocs(usersQuery);

            if (usersQuerySnapshot.empty) {
                setNoResults(true);
            } else {
                usersQuerySnapshot.forEach((user) => {
                    setSearchResults((prevResults) => [
                        ...prevResults,
                        user.data()
                    ]);
                });
            }
        };

        const searchTimer = setTimeout(() => {
            if (enteredSearch) {
                searchUsers();
            }
        }, 500);

        return () => clearTimeout(searchTimer);
    }, [enteredSearch]);

    return (
        <Fragment>
            {!isSearching &&
                <div 
                    className={classes.icon}
                    onClick={isSearchingHandler}
                >
                    <img src={searchIcon} alt='search' />
                </div>
            }
            {isSearching &&
                <Fragment>
                    <Backdrop onClick={isSearchingHandler} />
                    <div className={classes.search}>
                        <input 
                            autoFocus
                            type='text' 
                            name='search' 
                            placeholder='Search' 
                            autoComplete='off'
                            onChange={enteredSearchHandler}
                        />
                        {enteredSearch.length !== 0 &&
                            <div className={classes.results}>
                                {searchResults.length === 0 && !noResults &&
                                    <LoadingSpinner />
                                }
                                {noResults &&
                                    <p className={classes['no-results']}>No results.</p>
                                }
                                {searchResults !== 0 &&
                                    <ul>
                                        {searchResults.map((result, index) => (
                                            <li key={index}>
                                                <div className={classes.user}>
                                                    <Link 
                                                        to={`profile/${result.userId}`}
                                                        onClick={isSearchingHandler}
                                                    >
                                                        <ProfilePicture 
                                                            userId={result.userId}
                                                            size={'medium'}
                                                        />
                                                        <div className={classes.names}>
                                                            <span className={classes.username}>
                                                                {result.username}
                                                            </span>
                                                            <span className={classes.name}>
                                                                {result.name}
                                                            </span>
                                                        </div>
                                                    </Link>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                }
                            </div>
                        }
                    </div>
                </Fragment>
            }
        </Fragment>
    );
};

export default Search;