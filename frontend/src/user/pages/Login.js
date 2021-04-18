import React, { useState, useContext } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import useInputState from "../../hooks/useInputState";
import { AuthContext } from '../../shared/context/auth-context';
import ErrorModal from '../../shared/components/UIElements/ErrorModal'


function Login(props) {
  // const { loginUser } = props;
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
            <form onSubmit={handleSubmit}>
              <label htmlFor="username" style={{ display: "block" }}>
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


export default Login;