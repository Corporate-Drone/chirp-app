import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import { AuthContext } from '../../shared/context/auth-context';
import ErrorModal from '../../shared/components/UIElements/ErrorModal'
import './Login.css'


function Login(props) {
  const auth = useContext(AuthContext);
  const [displayError, setDisplayError] = useState();

  const history = useHistory();

  function loginUser(username, password) {
    try {
      const data = {
        username,
        password
      }
      axios.post('http://localhost:5000/auth/login', data)
        .then(response => {
          console.log(response.data)
          if (response.status === 200) {
            auth.login(response.data._id, response.data.username)
            history.push('/chirps');
          }
        })
        .catch((err) => setDisplayError('Login failed, please try again.'));
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
          password: ""
        }}
        onSubmit={async values => {
          loginUser(values.username, values.password)
        }}

        validationSchema={Yup.object().shape({
          username: Yup.string()
            .required("Required"),
          password: Yup.string()
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
            <div className="Login">
              <Link to={'/'}>
                <KeyboardBackspaceIcon /> Back
              </Link>
              <h1>Log in to Chirp</h1>
              <form onSubmit={handleSubmit}>
                <div className="Login-Username">
                  {/* <label htmlFor="username" style={{ display: "block" }}>
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
                        ? "text-input login-input error"
                        : "text-input login-input"
                    }
                  />
                  {errors.username && touched.username && (
                    <div className="input-feedback">{errors.username}</div>
                  )}
                </div>

                <div className="Login-Password">
                  {/* <label htmlFor="passowrd">Password</label> */}
                  <input
                    id="password"
                    type="password"
                    name="password"
                    placeholder="Password"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.password}
                    className={
                      errors.password && touched.password
                        ? "password-input login-input error"
                        : "password-input login-input"
                    }
                  />
                  {errors.password && touched.password && (
                    <span className="error">
                      {errors.password}
                    </span>
                  )}
                </div>


                <button className="Login-Submit" type="submit" disabled={isSubmitting}>
                  Login
            </button>

              </form>
            </div>
          );
        }}
      </Formik>
    </div>

  );
}


export default Login;