import React, { useState, useEffect, useContext } from "react";
import { Link, useParams, useHistory } from 'react-router-dom';
import axios from 'axios';
import useInputState from "../../hooks/useInputState";
import { AuthContext } from '../../shared/context/auth-context';

function UserSetup() {
    const auth = useContext(AuthContext);
    const [loadedUser, setLoadedUser] = useState();
    const [isLoading, setLoading] = useState(true);
    const [value, handleChange, reset] = useInputState("");

    const history = useHistory();

    const fetchUser = async () => {
        setLoading(true);
        //if reply fetch the thread and display the whole thread
        //else do below
        try {
            const res = await axios.get("http://localhost:5000/auth/setup", { params: { id: auth.userId } })
                .then(response => {

                    if (response.status === 200) {
                        setLoadedUser(response.data);
                        setLoading(false);
                        console.log('request made!')
                    }
                })
        } catch (error) {
            console.log(error)
            setLoading(false);
        }
    }

    useEffect(() => {
        // Update chirps on refresh
        fetchUser();

    }, []);

    function setupUser(about) {
        try {
            const data = {
                userId: auth.userId,
                about
            }
            axios.post('http://localhost:5000/auth/setup', data)
                .then(response => {
                    if (response.status === 200) {
                        setLoadedUser(response.data)
                        console.log(loadedUser)
                    }
                })
        } catch (error) {
            console.log(error)
        }
        history.push('/auth/setup');
    }

    let userAbout;
    if (loadedUser && loadedUser.about) {
        userAbout = (loadedUser.about)
    } else {
        userAbout = ('N/A')
    }

    return (
        <div>
            <div>
                Current Profile Picture
            </div>
            <div>
                Current About Me: {userAbout}
            </div>
            <form
                onSubmit={e => {
                    e.preventDefault();
                    setupUser(value)
                    reset();
                }}
                enctype="multipart/form-data"
            >
                <div>
                    <label htmlFor="image" className="form-label">Upload a profile picture </label>
                    <input type="file" id="image" name="image" />
                </div>
                <div>
                    <label htmlFor="about">About Me</label>
                    <textarea
                        className="form-control"
                        type="text"
                        id="about"
                        name="about"
                        onChange={handleChange}
                        value={value}
                    >
                    </textarea>
                </div>
                <button>Save</button>
            </form>
        </div>
    )
}

export default UserSetup
