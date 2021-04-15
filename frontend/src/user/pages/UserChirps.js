import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import useInputState from "../../hooks/useInputState";
import { AuthContext } from '../../shared/context/auth-context';
import { Link, useParams, useHistory } from 'react-router-dom';
import CircularIndeterminate from '../../shared/components/UIElements/CircularIndeterminate'
import Chirp from '../../chirps/components/Chirp';
import sortDate from '../../javascripts/sortDate'
import avatarplaceholder from '../../images/avatarplaceholder.gif'

function UserChirps(props) {
    const { userId } = useParams()
    const [loadedChirps, setLoadedChirps] = useState();
    const [loadedUser, setLoadedUser] = useState();
    const [isLoading, setLoading] = useState(true);

    const auth = useContext(AuthContext);

    const getUserChirps = async (userId) => {
        setLoading(true);
        try {
            const res = await axios.get("http://localhost:5000/:userId", { params: { id: userId } })
                .then(response => {

                    if (response.status === 200) {
                        setLoadedChirps(response.data)
                        console.log(response.data)
                    }
                })
        } catch (error) { console.log(error) }

        setLoading(false);
    }

    useEffect(() => {
        // Update chirps on refresh
        getUserChirps(userId);

    }, []);

    const followUser = async () => {
        try {
            const data = {
                actionUsername: userId,
                reqUserId: auth.userId
            }
            axios.post('http://localhost:5000/:userId', data)
                .then(response => {
                    console.log(response.data)
                    if (response.status === 200) {
                        console.log('post req made!')
                    }
                })
        } catch (error) {

        }
    }


    useEffect(() => {
        // sort chirps from newest to oldest
        if (loadedChirps) {
            console.log('Chirps are loaded.')
            setLoadedUser(loadedChirps[0].author)
        }
    }, [isLoading, loadedChirps]); //run when changes to isLoading or chirps

    let chirps;
    if (loadedChirps) {
        chirps = loadedChirps.map(c => (
            <Chirp
                key={c.id}
                {...c}
                username={c.author.username}
                author={c.author}
            />
        ))
        sortDate(loadedChirps)
    }

    let followButton;
    if (userId !== auth.username) {
        if (loadedUser && loadedUser.followers.includes(auth.userId)) {
            followButton = (
                <button onClick={followUser}>Unfollow</button>
            )
        } else {
            followButton = (
                <button onClick={followUser}>Follow</button>
            )
        }
    }

    return (
        <div>
            {isLoading && <CircularIndeterminate />}
            {!isLoading && <div>
                {userId} {followButton}
            </div>}
            {loadedUser && loadedUser.image && <img src={loadedUser.image.url} />}
            {loadedUser && !loadedUser.image && <img src={avatarplaceholder} />}
            {loadedUser && loadedUser.about && <div>{loadedUser.about}</div>}
            <Link to={`/${userId}/following`}>
                {loadedUser && <div>{loadedUser.following.length} following</div>}
            </Link>
            <Link to={`/${userId}/followers`}>
                {loadedUser && <div>{loadedUser.followers.length} followers</div>}
            </Link>

            {/* display join date */}
            {!isLoading && <div>{chirps}</div>}
        </div>
    )
}

export default UserChirps;

//post request (userId from params):
//get user information
//get all chirps & replies created User