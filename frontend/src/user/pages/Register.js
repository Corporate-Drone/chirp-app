import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { AuthContext } from '../../shared/context/auth-context';
import useInputState from "../../hooks/useInputState";
import ErrorModal from '../../shared/components/UIElements/ErrorModal'

function Register(props) {
    // const { registerUser } = props;
    const auth = useContext(AuthContext);
    const [displayError, setDisplayError] = useState();

    const history = useHistory();

    function registerUser(username, email, password) {
        // const headers = {
        //   'Content-Type': 'application/json',
        // }
        try {
            const data = {
                username,
                email,
                password
            }
            axios.post('http://localhost:5000/auth/register', data)
                .then(response => {
                    // console.log(response.data)
                    if (response.status === 200) {
                        auth.login(response.data._id, response.data.username) //login user after registering
                        history.push('/chirps'); //redirect to chirps
                    }
                })
                .catch((err) => setDisplayError(err.response.data.message));
        } catch (error) {
            console.log(error)
        }

    }


    return (
        <div>
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
                            <label htmlFor="username">
                                Username
              </label>
                            <input
                                id="username"
                                placeholder="Enter your username"
                                type="text"
                                value={values.username}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={
                                    errors.username && touched.username
                                        ? "text-input error"
                                        : "text-input"
                                }
                            />
                            {errors.username && touched.username && (
                                <div className="input-feedback">{errors.username}</div>
                            )}

                            <label htmlFor="email">
                                Email
                            </label>
                            <input
                                id="email"
                                placeholder="Enter your email"
                                type="text"
                                value={values.email}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={
                                    errors.email && touched.email
                                        ? "text-input error"
                                        : "text-input"
                                }
                            />
                            {errors.email && touched.email && (
                                <div className="input-feedback">{errors.email}</div>
                            )}

                            <label htmlFor="passowrd">Password</label>
                            <input
                                type="password"
                                name="password"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.password}
                            />
                            {errors.password && touched.password && (
                                <span className="error">
                                    {errors.password}
                                </span>
                            )}

                            <button type="submit" disabled={isSubmitting}>
                                Submit
              </button>

                        </form>
                    );
                }}
            </Formik>
        </div>
    );
}


export default Register;