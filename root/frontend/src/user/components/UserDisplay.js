import React, { useState, useEffect, useContext } from "react";
import axios from 'axios';
import { AuthContext } from '../../shared/context/auth-context';
import followUser from "../../javascripts/followUser";
import { Link } from 'react-router-dom';
import './UserDisplay.css'
import avatarplaceholder from '../../images/avatarplaceholder.gif'
import useToggleState from "../../hooks/useToggleState";

function UserDisplay(props) {
    const [isFollowing, toggle] = useToggleState();

    const auth = useContext(AuthContext);

    const { username, image, followers, following, about } = props;
    
    const userId = username;


    useEffect(() => {
            //set isFollowing to true if current user is following
            if (followers && followers.includes(auth.userId)) {
                toggle()
            }
    }, [])

    const handleFollowButton = async () => {
        // followUser()
        followUser(userId,auth.userId)
        toggle()
    }

    let followtButton;
    if (userId !== auth.username) {
        if (isFollowing) {
            followtButton = (
                <button onClick={handleFollowButton}>Unfollow</button>
            )


        } else {
            followtButton = (
                <button onClick={handleFollowButton}>Follow</button>
            )
        }
    }

    let profilePicture;
    if (!image || image.url === undefined) {
        profilePicture = (
            <img src={avatarplaceholder} className="UserDisplay-image" />
        )
    } else {
        profilePicture = (
            <img src={image.url} className="UserDisplay-image" />
        )
    }

    return (
        <div className="UserDisplay">
            <div className="UserDisplay-images">
                {profilePicture}
            </div>
            <div className="UserDisplay-username">
                <Link to={`/${username}`}>
                    <div>{username}</div>
                </Link>
                <div className="UserDisplay-about">
                    {about && <div>{about}</div>}
                </div>
            </div>
            <div>{followtButton}</div>
        </div>
    )
}

export default UserDisplay;