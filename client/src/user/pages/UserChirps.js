import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../shared/context/auth-context';
import followUser from "../../javascripts/followUser";
import { Link, useParams, useLocation } from 'react-router-dom';
import CircularIndeterminate from '../../shared/components/UIElements/CircularIndeterminate'
import Chirp from '../../chirps/components/Chirp';
import sortDate from '../../javascripts/sortDate'
import avatarplaceholder from '../../images/avatarplaceholder.gif'
import useToggleState from "../../hooks/useToggleState";
import PersonIcon from '@material-ui/icons/Person';
import './UserChirps.css';

function UserChirps(props) {
    const { userId } = useParams()
    const [loadedChirps, setLoadedChirps] = useState();
    const [loadedLikes, setLoadedLikes] = useState();
    const [loadedUser, setLoadedUser] = useState();
    const [isLoading, setLoading] = useState(true);
    const [isFollowing, toggle] = useToggleState();
    const [viewState, setViewState] = useState('chirps');
    const [followCount, setFollowCount] = useState();

    const auth = useContext(AuthContext);
    const location = useLocation();

    const getUserChirps = async (userId, type = 'chirps') => {
        setLoading(true);
        try {
            const res = await axios.get("/:userId", { params: { id: userId, type } })
                .then(response => {

                    if (response.status === 200) {
                        if (type === 'chirps') {
                            setLoadedChirps(response.data)
                        } else {
                            setLoadedUser(response.data)
                        }

                    }
                })
        } catch (error) { console.log(error) }

        setLoading(false);
    }

    const getLikedChirps = async () => {
        setLoading(true)
        try {
            const res = await axios.get("/:userId/likes", { params: { id: userId } })
                .then(response => {

                    if (response.status === 200) {
                        setLoadedLikes(response.data)
                    }
                })

        } catch (error) {
            console.log(error)
        }
        setLoading(false);
    }

    const getUser = () => {
        let type = 'user'
        getUserChirps(userId, type)
    }

    useEffect(() => {
        // Update chirps on refresh
        getUserChirps(userId); //fetch user chirps
        getUser() //fetch user data
        getLikedChirps();
    }, [location])

    useEffect(() => {
        if (loadedUser) {
            setFollowCount(loadedUser.followers.length);

            //set isFollowing to true if current user is following
            if (loadedUser.followers.includes(auth.userId)) {
                toggle()
            }
        }
    }, [loadedChirps,loadedUser]) //run when changes to chirps or user

    const handleView = async (type) => {
        setViewState(type)
    }

    const handleFollowButton = async () => {
        if (isFollowing) {
            setFollowCount(followCount - 1)
        } else {
            setFollowCount(followCount + 1)
        }
        followUser(userId, auth.userId)
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

    let likedChirps;
    if (loadedLikes) {
        likedChirps = loadedLikes.map(c => (
            <Chirp
                key={c.id}
                {...c}
                username={c.author.username}
                author={c.author}
            />
        ))
        sortDate(loadedLikes)
    }

    let editButton;
    let followtButton;
    if (userId !== auth.username) {
        if (isFollowing) {
            followtButton = (
                <button className="UserChirps-profile-btn" onClick={handleFollowButton}>Unfollow</button>
            )


        } else {
            followtButton = (
                <button className="UserChirps-profile-btn" onClick={handleFollowButton}>Follow</button>
            )
        }
    } else {
        editButton = (
            <Link to="/auth/setup">
                <button className="UserChirps-profile-btn">Edit Profile</button>
            </Link>
        )
    }

    let viewDisplay;
    if (viewState === 'chirps') {
        viewDisplay = (
            <div className="UserChirps-tab">
                <div className="UserChirps-chirps tab" id="clicked" onClick={() => handleView('chirps')}>
                    {!isLoading && loadedChirps && <div>
                        Chirps {loadedChirps.length}
                    </div>}
                </div>
                {!isLoading && loadedLikes && <div className="UserChirps-likes tab" onClick={() => handleView('likes')}>
                    Likes {loadedLikes.length}
                </div>}
            </div>
        )
    } else {
        viewDisplay = (
            <div className="UserChirps-tab">
                <div className="UserChirps-chirps tab" onClick={() => handleView('chirps')}>
                    {!isLoading && loadedChirps && <div>
                        Chirps {loadedChirps.length}
                    </div>}
                </div>
                {!isLoading && loadedLikes && <div className="UserChirps-likes tab" id="clicked" onClick={() => handleView('likes')}>
                    Likes {loadedLikes.length}
                </div>}
            </div>
        )
    }

    let profilePicture;
    if (loadedUser) {
        if (!loadedUser.image || loadedUser.image.url === undefined) {
            profilePicture = (
                <img src={avatarplaceholder} className="UserDisplay-image" />
            )
        } else {
            profilePicture = (
                <img src={loadedUser.image.url} className="UserDisplay-image" />
            )
        }
    } else { //no loadedUser if user hasn't created any Chirps
        profilePicture = (
            <img src={avatarplaceholder} className="UserDisplay-image" />
        )
    }


    return (
        <div>
            {isLoading && <CircularIndeterminate />}
            {!isLoading && <div className="UserChirps-profile">
                <div className="UserChirps-edit">
                    <div><PersonIcon /> Profile</div>
                    <div>
                        {!isLoading && followtButton}
                        {!isLoading && <div>{editButton}</div>}
                    </div>
                </div>
                <div className="UserChirps-image-name">
                    <div>
                        {profilePicture}
                    </div>
                    <div className="UserChirps-about-container">
                        <div className="UserChirps-about">
                            {loadedUser && loadedUser.about && <div>{loadedUser.about}</div>}
                        </div>
                    </div>
                </div>
                <div className="UserChirps-name-follow">
                    {!isLoading && <div className="UserChirps-name">
                        {userId}
                    </div>}
                    <div className="UserChirps-follow">
                        <div className="UserChirps-following">
                            <Link to={`/${userId}/following`}>
                                {loadedUser && <div><span className="UserChirps-count">{loadedUser.following.length}</span> following</div>}
                            </Link>
                        </div>
                        <div className="UserChirps-followers">            <Link to={`/${userId}/followers`}>
                            {loadedUser && <div><span className="UserChirps-count">{followCount} </span> followers</div>}
                        </Link></div>
                    </div>
                </div>
                {viewDisplay}
            </div>}
            {!isLoading && viewState === 'chirps' && <div>{chirps}</div>}
            {!isLoading && viewState === 'likes' && <div>{likedChirps}</div>}
        </div>
    )
}

export default UserChirps;
