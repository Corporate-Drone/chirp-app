import React, { useState, useContext } from 'react';
import { Link,useHistory } from 'react-router-dom';
import axios from 'axios';
import { Formik } from 'formik';
import * as Yup from 'yup';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import { AuthContext } from '../../shared/context/auth-context';
import ErrorModal from '../../shared/components/UIElements/ErrorModal'
import './Register.css'

function Register() {
    const auth = useContext(AuthContext);
    const [displayError, setDisplayError] = useState();

    const history = useHistory();

    function registerUser(username, email, password) {
        try {
            const data = {
                username,
                email,
                password
            }
            axios.post('/auth/register', data)
                .then(response => {
                    if (response.status === 200) {
                        auth.login(response.data.updatedUser._id, response.data.updatedUser.username,response.data.token) //login user after registering
                        history.push('/chirps'); //redirect to chirps
                    }
                })
                .catch((err) => setDisplayError(err.response.data.message));
        } catch (error) {
            console.log(error)
        }

    }


    return (
        <div className="Register">
            <Link to={'/'}>
                <KeyboardBackspaceIcon /> Back
              </Link>
            <h1>Create your account</h1>
            {displayError && <ErrorModal message={displayError} setDisplayError={setDisplayError} />}
            <Formik
                initialValues={{
                    username: "",
                    email: "",
                    password: ""
                }}
                onSubmit={async values => {
                    registerUser(values.username, values.email, values.password)
                }}

                validationSchema={Yup.object().shape({
                    username: Yup.string()
                        .min(2, 'At least 2 characters required.')
                        .max(15, 'Must be less than 15 characters.')
                        .required("Required"),
                    password: Yup.string()
                        .required("Required"),
                    email: Yup.string()
                        .email()
                        .required("Required")
                })}
            >
                {props => {
                    const {
                        values,
                        touched,
                        errors,
                        dirty,
                        isSubmitting,
                        handleChange,
                        handleBlur,
                        handleSubmit,
                        handleReset
                    } = props;
                    return (
                        <form onSubmit={handleSubmit}>
                            <div className="Register-Username">
                                {/* <label htmlFor="username">
                                    Username
              </label> */}
                                <input
                                    id="username"
                                    placeholder="Enter your username"
                                    type="text"
                                    value={values.username}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={
                                        errors.username && touched.username
                                            ? "text-input register-input error"
                                            : "text-input register-input"
                                    }
                                />
                                {errors.username && touched.username && (
                                    <div className="input-feedback">{errors.username}</div>
                                )}
                            </div>

                            <div className="Register-Email">
                                {/* <label htmlFor="email">
                                    Email
                            </label> */}
                                <input
                                    id="email"
                                    placeholder="Enter your email"
                                    type="text"
                                    value={values.email}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={
                                        errors.email && touched.email
                                            ? "text-input register-input error"
                                            : "text-input register-input"
                                    }
                                />
                                {errors.email && touched.email && (
                                    <div className="input-feedback">{errors.email}</div>
                                )}
                            </div>

                            <div className="Register-Password">
                                {/* <label htmlFor="passowrd">Password</label> */}
                                <input
                                    type="password"
                                    name="password"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.password}
                                    placeholder="Password"
                                    className={
                                        errors.password && touched.password
                                            ? "password-input register-input error"
                                            : "password-input register-input"
                                    }
                                />
                                {errors.password && touched.password && (
                                    <span className="error">
                                        {errors.password}
                                    </span>
                                )}
                            </div>


                            <button type="submit" disabled={isSubmitting}>
                                Register
              </button>

                        </form>
                    );
                }}
            </Formik>
        </div>
    );
}


export default Register;