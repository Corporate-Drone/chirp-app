import React, { useState, useEffect } from "react";
import { Link, useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import UserDisplay from '../components/UserDisplay';
import './UserFollow.css'

function UserFollow(props) {
    const { type } = props;
    const { userId } = useParams()
    const [loadedConnections, setLoadedConnections] = useState();
    const [isLoading, setLoading] = useState(true);

    const location = useLocation();

    const getUserConnections = async (userId, type) => {
        setLoading(true);
        try {
            //get followers/following depending on type value
            const res = await axios.get(`http://localhost:5000/:userId/${type}`, { params: { id: userId, type } })
                .then(response => {

                    if (response.status === 200) {
                        setLoadedConnections(response.data)
                        console.log(response.data)
                    }
                })
        } catch (error) {
            console.log(error)
        }

        setLoading(false);
    }

    useEffect(() => {
        getUserConnections(userId, type);
    }, []);

    useEffect(() => {
        getUserConnections(userId, type);
    }, [location]);

    let users;
    if (loadedConnections) {
        users = loadedConnections.map(u => (
            <UserDisplay
                key={u._id}
                username={u.username}
                image={u.image}
                followers={u.followers}
                following={u.following}
                about={u.about}
            />
        ))

        if (loadedConnections.length === 0) {
            users = (
                <div className="UserFollow-none">
                    No {type} to display.
                </div>
            )
        }
    }

    let followDisplay;
    if (type === 'following') {
        followDisplay = (
            <div className="UserFollow-tabs">
                <Link to={`/${userId}/followers`}>
                    <div className="UserFollow-followers">
                        Followers
                    </div>
                </Link>
                <Link to={`/${userId}/following`}>
                    <div className="UserFollow-following" id="clicked">
                        Following
                    </div>
                </Link>
            </div>
        )
    } else {
        followDisplay = (
            <div className="UserFollow-tabs">
                <Link to={`/${userId}/followers`}>
                    <div className="UserFollow-followers" id="clicked">
                        Followers
                    </div>
                </Link>
                <Link to={`/${userId}/following`}>
                    <div className="UserFollow-following">
                        Following
                    </div>
                </Link>
            </div>
        )
    }


    return (
        <div className="UserFollow">
            <div className="UserFollow-top">
                <Link to={`/${userId}`}>
                    <KeyboardBackspaceIcon />
                </Link>
                <Link to={`/${userId}`}>
                    <div className="UserFollow-username">{userId}</div>
                </Link>
            </div>
            {followDisplay}
            {!isLoading && < div className="UserFollow-users">
                {users}
            </div>}
        </div>
    )
}

export default UserFollow;