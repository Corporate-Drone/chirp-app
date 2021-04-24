import React from "react";
import { Link } from 'react-router-dom';

import avatarplaceholder from '../../images/avatarplaceholder.gif'

function UserDisplay(props) {
    const { username, image, followers, following } = props;
    return (
        <div>
            <Link to={`/${username}`}>
                <div>{username}</div>
            </Link>
            <div>{followers.length} followers {following.length} following</div>
            {image && <img src={image.url} />}
            {!image && <img src={avatarplaceholder} />}
        </div>
    )
}

export default UserDisplay;