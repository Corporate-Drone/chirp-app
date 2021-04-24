import React, { useState, useEffect, useContext } from "react";
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import useInputState from "../../hooks/useInputState";
import { AuthContext } from '../../shared/context/auth-context';
import avatarplaceholder from '../../images/avatarplaceholder.gif'
import CircularIndeterminate from '../../shared/components/UIElements/CircularIndeterminate'

function UserSetup() {
    const auth = useContext(AuthContext);
    const [loadedUser, setLoadedUser] = useState();
    const [loadedImage, setLoadedImage] = useState();
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


    useEffect(() => {
        //send image info to backend after successful upload to Cloudinary
        try {
            const data = {
                userId: auth.userId,
                url: loadedImage.secure_url,
                filename: loadedImage.public_id
            }
            axios.post('http://localhost:5000/auth/setup/upload', data)
                .then(response => {
                    if (response.status === 200) {
                        setLoadedUser(response.data)
                        setLoading(false); //set true from handleImageUpload()
                    }
                })
        } catch (error) {
            console.log(error)
            setLoading(false); //set true from handleImageUpload()
        }

    }, [loadedImage])

    function setupUser(about) {
        //update About Me only if a value has been entered
        if (about !== "") {
            try {
                const data = {
                    userId: auth.userId,
                    about
                }
                axios.post('http://localhost:5000/auth/setup', data)
                    .then(response => {
                        if (response.status === 200) {
                            setLoadedUser(response.data)
                        }
                    })
            } catch (error) {
                console.log(error)
            }
            history.push('/auth/setup');
        }
    }

    const handleImageUpload = () => {
        if (document.getElementById("image").value != "") {
            setLoading(true);
            const { files } = document.querySelector('input[type="file"]')
            const formData = new FormData();
            formData.append('file', files[0]);

            formData.append('upload_preset', 'znbfdysx');
            const options = {
                method: 'POST',
                body: formData,
            };

            return fetch('https://api.Cloudinary.com/v1_1/dw2bqpmjv/image/upload', options)
                .then(res => res.json())
                .then(res =>
                    setLoadedImage(res)
                )
                .catch(err => console.log(err));
        }
    }

    const removeImage = () => {
        if (loadedUser.image.url) {
            setLoading(true);
        try {
            const authorizationToken = localStorage.getItem('token');
            const headers = {
                Authorization: authorizationToken
            }
            const data = {
                userId: auth.userId,
                url: loadedUser.image.url,
                filename: loadedUser.image.filename
            }
            axios.delete('http://localhost:5000/auth/setup/upload', { headers, data })
                .then(response => {
                    if (response.status === 200) {
                        setLoadedUser(response.data)
                        setLoading(false);
                    }
                })
        } catch (error) {
            console.log(error)
            setLoading(false);
        }
        }
    }

    const deleteAccount = () => {
        try {
            const authorizationToken = localStorage.getItem('token');
            const headers = {
                Authorization: authorizationToken
            }

            let data;
            if (loadedUser.image) {
                data = {
                    userId: auth.userId,
                    url: loadedUser.image.url,
                    filename: loadedUser.image.filename,
                    username: auth.username
                }
            } else {
                data = {
                    userId: auth.userId,
                    username: auth.username
                }
            }

            axios.delete('http://localhost:5000/auth/setup/', { headers, data })
                .then(response => {
                    if (response.status === 200) {
                        setLoading(false);
                    }
                })
        } catch (error) {
            console.log(error)
        }
        auth.logout();
        history.push('/');
    }

    let userAbout;
    if (loadedUser && loadedUser.about) {
        userAbout = (loadedUser.about)
    } else {
        userAbout = ('N/A')
    }

    let userImage;
    if (loadedUser && !loadedUser.image || loadedUser && loadedUser.image.url === undefined) {
        userImage = (< img src={avatarplaceholder} />)
    } else if (loadedUser && loadedUser.image) {
        userImage = (< img src={loadedUser.image.url} />)
    }

    return (
        <div>
            {isLoading && <CircularIndeterminate />}
            {!isLoading && <div>
                <div>
                    {userImage}
                Current Profile Picture
            </div>
                <div>
                    Current About Me: {userAbout}
                </div>
                <form
                    onSubmit={e => {
                        e.preventDefault();
                        setupUser(value)
                        handleImageUpload();
                        reset();
                    }}
                    encType="multipart/form-data"
                >
                    <div>
                        <label htmlFor="image" className="form-label">Upload a profile picture </label>
                        <input type="file" id="image" name="image" />
                    </div>
                    <div>
                        <label htmlFor="about">Update About Me</label>
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
                <div>
                    <button onClick={() => removeImage()}>Remove Profile Picture</button>
                </div>
                <button onClick={deleteAccount}>Delete Account</button>
            </div>}
        </div>
    )
}

export default UserSetup
