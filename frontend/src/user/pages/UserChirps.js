import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../shared/context/auth-context';
import { Link, useParams, useLocation } from 'react-router-dom';
import CircularIndeterminate from '../../shared/components/UIElements/CircularIndeterminate'
import Chirp from '../../chirps/components/Chirp';
import sortDate from '../../javascripts/sortDate'
import avatarplaceholder from '../../images/avatarplaceholder.gif'
import useToggleState from "../../hooks/useToggleState";

function UserChirps(props) {
    const { userId } = useParams()
    const [loadedChirps, setLoadedChirps] = useState();
    const [loadedUser, setLoadedUser] = useState();
    const [isLoading, setLoading] = useState(true);
    const [isFollowing, toggle] = useToggleState();
    const [followCount, setFollowCount] = useState();

    const auth = useContext(AuthContext);
    const location = useLocation();

    const getUserChirps = async (userId) => {
        setLoading(true);
        try {
            const res = await axios.get("http://localhost:5000/:userId", { params: { id: userId } })
                .then(response => {

                    if (response.status === 200) {
                        setLoadedChirps(response.data)
                    }
                })
        } catch (error) { console.log(error) }

        setLoading(false);
    }

    useEffect(() => {
        // Update chirps on refresh
        getUserChirps(userId);
    },[location])

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
        if (loadedChirps) {
            setLoadedUser(loadedChirps[0].author)

            if (loadedUser) {
                setFollowCount(loadedUser.followers.length);
            }

            //set isFollowing to true if current user is following
            if (loadedUser && loadedUser.followers.includes(auth.userId)) {
                toggle()
            }
        }
    }, [isLoading, loadedChirps]); //run when changes to isLoading or chirps

    const handleFollowButton = async () => {
        if (isFollowing) {
            setFollowCount(followCount - 1)
        } else {
            setFollowCount(followCount + 1)
        }
        followUser()
        toggle()

    }

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

    let editButton;
    let testButton;
    if (userId !== auth.username) {
        if (isFollowing) {
            testButton = (
                <button onClick={handleFollowButton}>Unfollow</button>
            )
    
    
        } else {
            testButton = (
                <button onClick={handleFollowButton}>Follow</button>
            )
        }
    } else {
        editButton = (
            <Link to="/auth/setup">
                <button>Edit Profile</button>
            </Link>
        )
    }
   

    return (
        <div>
            {isLoading && <CircularIndeterminate />}
            {!isLoading && <div>
                {userId}
            </div>}
            {!isLoading && testButton}
            {!isLoading && loadedChirps && <div>
                {loadedChirps.length} Chirps
                </div>}
            {!isLoading && <div>{editButton}</div>}
            {loadedUser && loadedUser.image && <img src={loadedUser.image.url} />}
            {loadedUser && !loadedUser.image && <img src={avatarplaceholder} />}
            {loadedUser && loadedUser.about && <div>{loadedUser.about}</div>}
            <Link to={`/${userId}/following`}>
                {loadedUser && <div>{loadedUser.following.length} following</div>}
            </Link>
            <Link to={`/${userId}/followers`}>
                {loadedUser && <div>{followCount} followers</div>}
            </Link>
            {!isLoading && <div>{chirps}</div>}
        </div>
    )
}

export default UserChirps;

//post request (userId from params):
//get user information
//get all chirps & replies created User