import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../shared/context/auth-context';
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

    const getLikedChirps = async () => {
        setLoading(true)
        try {
            const res = await axios.get("http://localhost:5000/:userId/likes", { params: { id: userId } })
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

    useEffect(() => {
        // Update chirps on refresh
        getUserChirps(userId);
        getLikedChirps();
    }, [location])

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

    const handleView = async (type) => {
        setViewState(type)
    }

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


    return (
        <div>
            {isLoading && <CircularIndeterminate />}
            {/* {!isLoading && <div>
                {userId}
            </div>}
            {!isLoading && followtButton}
            {!isLoading && loadedChirps && <div>
                {loadedChirps.length} Chirps
                </div>}
            {!isLoading && <div>{editButton}</div>}
            {loadedUser && loadedUser.image && <img className="UserChirps-picture" src={loadedUser.image.url} />}
            {loadedUser && !loadedUser.image && <img className="UserChirps-picture" src={avatarplaceholder} />}
            {loadedUser && loadedUser.about && <div>{loadedUser.about}</div>}
            <Link to={`/${userId}/following`}>
                {loadedUser && <div>{loadedUser.following.length} following</div>}
            </Link>
            <Link to={`/${userId}/followers`}>
                {loadedUser && <div>{followCount} followers</div>}
            </Link> */}
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
                        {loadedUser && loadedUser.image && <img className="UserChirps-picture" src={loadedUser.image.url} />}
                        {loadedUser && !loadedUser.image && <img className="UserChirps-picture" src={avatarplaceholder} />}
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
                {/* <div className="UserChirps-tab">
                    <div className="UserChirps-chirps" onClick={() => handleView('chirps')}>
                        {!isLoading && loadedChirps && <div>
                            Chirps {loadedChirps.length}
                        </div>}
                    </div>
                    {!isLoading && loadedLikes && <div className="UserChirps-likes" onClick={() => handleView('likes')}>
                        Likes {loadedLikes.length}
                    </div>}
                </div> */}
                {viewDisplay}
            </div>}
            {!isLoading && viewState === 'chirps' && <div>{chirps}</div>}
            {!isLoading && viewState === 'likes' && <div>{likedChirps}</div>}
        </div>
    )
}

export default UserChirps;
