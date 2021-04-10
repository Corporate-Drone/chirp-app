import React, { useState, useEffect, useContext } from "react";
import { Link, useParams, useHistory } from 'react-router-dom';
import axios from 'axios';
import useInputState from "../../hooks/useInputState";
import { AuthContext } from '../../shared/context/auth-context';

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
                filename: loadedImage.public_id.slice(6)
            }
            axios.post('http://localhost:5000/auth/setup/upload', data)
                .then(response => {
                    if (response.status === 200) {
                    console.log('Successful')
                }
            })
        } catch (error) {
            console.log(error)
        }
    },[loadedImage])

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

    const handleImageUpload = () => {
        const { files } = document.querySelector('input[type="file"]')
        const formData = new FormData();
        formData.append('file', files[0]);
        // replace this with your upload preset name
        formData.append('upload_preset', 'znbfdysx');
        const options = {
          method: 'POST',
          body: formData,
        };
        
        // replace cloudname with your Cloudinary cloud_name
        return fetch('https://api.Cloudinary.com/v1_1/dw2bqpmjv/image/upload', options)
          .then(res => res.json())
            .then(res =>
                setLoadedImage(res)
            )
          .catch(err => console.log(err));
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
                // onSubmit={e => {
                //     e.preventDefault();
                //     setupUser(value)
                //     reset();
                // }}
                onSubmit={e => {
                    e.preventDefault();
                    handleImageUpload();
                }}
                encType="multipart/form-data"
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
