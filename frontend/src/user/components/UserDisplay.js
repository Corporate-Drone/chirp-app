import React from "react";
import { Link } from 'react-router-dom';
import './UserDisplay.css'
import avatarplaceholder from '../../images/avatarplaceholder.gif'

function UserDisplay(props) {
    const { username, image, followers, following, about } = props;
    return (
        <div className="UserDisplay">
            <div className="UserDisplay-images">
                {image && <img className="UserDisplay-image" src={image.url} />}
                {!image && <img className="UserDisplay-image" src={avatarplaceholder} />}
            </div>
            <div className="UserDisplay-username">
                <Link to={`/${username}`}>
                    <div>{username}</div>
                </Link>
                <div className="UserDisplay-about">
                    {about && <div>{about}</div>}
                </div>
            </div>
            {/* <div className="UserDisplay-follow">
            <div>{followers.length} followers {following.length} following</div>
            </div> */}
        </div>
    )
}

export default UserDisplay;