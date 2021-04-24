import React, { useState, useEffect } from "react";
import { Link, useParams, useLocation } from 'react-router-dom';
import axios from 'axios';

import UserDisplay from '../components/UserDisplay';

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
            />
        ))
    }


    return (
        <div>
            <Link to={`/${userId}/followers`}>
                <p>Followers</p>
            </Link>
            <Link to={`/${userId}/following`}>
                <p>Following</p>
            </Link>
            {users}
        </div>
    )
}

export default UserFollow;