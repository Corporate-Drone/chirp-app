import React, { useState, useEffect } from "react";
import axios from 'axios';
import UserDisplay from '../components/UserDisplay';
import './Users.css';
import CircularIndeterminate from '../../shared/components/UIElements/CircularIndeterminate'

function Users(props) {

    const [loadedUsers, setLoadedUsers] = useState();
    const [isLoading, setLoading] = useState(true);

    let users;
    if (loadedUsers) {
        users = loadedUsers.map(u => (
            <UserDisplay
                key={u._id}
                username={u.username}
                image={u.image}
                followers={u.followers}
                following={u.following}
                about={u.about}
            />
        ))
    }

    const getUsers = async () => {

        setLoading(true);
        try {
            const res = await axios.get('/users')
                .then(response => {

                    if (response.status === 200) {
                        setLoadedUsers(response.data)
                        setLoading(false);
                    }
                })
        } catch (error) {
            console.log(error)
            setLoading(false);
        }
    }

    useEffect(() => {
        getUsers()
    },[])

    return (
        <div className="Users">
             {isLoading && <CircularIndeterminate/>}
            {!isLoading && <div>
                <h1>All Users</h1>
                {users}
            </div>}
        </div>
    )
}

export default Users;