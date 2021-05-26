import React, { useState, useEffect, useContext } from "react";
import { Link,useHistory } from 'react-router-dom';
import axios from 'axios';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import useInputState from "../../hooks/useInputState";
import { AuthContext } from '../../shared/context/auth-context';
import avatarplaceholder from '../../images/avatarplaceholder.gif'
import CircularIndeterminate from '../../shared/components/UIElements/CircularIndeterminate'
import AlertDialog from '../../shared/components/UIElements/AlertDialog'
import './UserSetup.css'

function UserSetup() {
    const auth = useContext(AuthContext);
    const [loadedUser, setLoadedUser] = useState();
    const [loadedImage, setLoadedImage] = useState();
    const [isLoading, setLoading] = useState(true);
    const [value, handleChange, reset] = useInputState("");
    const [displayConfirmation, setDisplayConfirmation] = useState(false);

    const history = useHistory();

    const fetchUser = async () => {
        setLoading(true);
        //if reply fetch the thread and display the whole thread
        //else do below
        try {
            const res = await axios.get("/auth/setup", { params: { id: auth.userId } })
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
            axios.post('/auth/setup/upload', data)
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
                axios.post('/auth/setup', data)
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
                axios.delete('/auth/setup/upload', { headers, data })
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

            axios.delete('/auth/setup/', { headers, data })
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

    const handleDeleteAccount = () => {
        setDisplayConfirmation(true)
    }

    let userAbout;
    if (loadedUser && loadedUser.about) {
        userAbout = (loadedUser.about)
    } else {
        userAbout = ('About Me: N/A')
    }

    let userImage;
    if (loadedUser && !loadedUser.image || loadedUser && loadedUser.image.url === undefined) {
        userImage = (< img className="UserSetup-image" src={avatarplaceholder} />)
    } else if (loadedUser && loadedUser.image) {
        userImage = (< img className="UserSetup-image" src={loadedUser.image.url} />)
    }

    return (
        <div>
            {displayConfirmation && <AlertDialog setDisplayConfirmation={setDisplayConfirmation} deleteAccount={deleteAccount} />}
            {isLoading && <CircularIndeterminate />}
            {!isLoading && <div className="UserSetup">
                <div className="UserSetup-back">
                <Link to={`/${auth.username}`}>
                    <KeyboardBackspaceIcon />
                </Link>
                <Link to={`/${auth.username}`}>
                    <div className="UserSetup-back-user">Back to Profile</div>
                </Link>
                </div>
                <div className="UserSetup-profile">
                    <div>
                        <div>
                            {userImage}
                        </div>
                        <div>
                            <button id="UserSetup-remove-picture" onClick={() => removeImage()}>Remove</button>
                        </div>
                    </div>
                    <div className="UserSetup-about">
                        {userAbout}
                    </div>
                    <div>
                        <button id="UserSetup-remove-account" onClick={handleDeleteAccount}>Delete User</button>
                    </div>
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
                    <div className="UserSetup-upload">
                        <label htmlFor="image" className="form-label" id="upload">Upload</label>
                        <input type="file" id="image" name="image" />
                    </div>
                    <div className="UserSetup-update">
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
                    <button id="UserSetup-save">Save</button>
                </form>
            </div>}
        </div>
    )
}

export default UserSetup
