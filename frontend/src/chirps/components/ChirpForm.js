import React, { useState, useContext } from 'react';
import axios from 'axios';
import { Formik } from 'formik';
import * as Yup from 'yup';
import getDate from "../../javascripts/currentDate";
import { AuthContext } from '../../shared/context/auth-context';

function ChirpForm(props) {
    const { fetchChirps } = props;
    const auth = useContext(AuthContext);

    const addChirp = async (newChirp) => {
        // setChirps([...chirps, { info: newChirp, replies: [], rechirps: [], likes: 0, date: getDate() }])
        try {
            const data = {
                text: newChirp,
                replies: [],
                likes: [],
                date: getDate(),
                author: auth.userId
            }
            await axios.post('http://localhost:5000/chirps', data)
                .then(response => {
                    console.log(response.data)
                    if (response.status === 200) {
                        console.log(response.data)
                        fetchChirps();
                    }
                })
        } catch (error) {
            console.log(error)
        }

    }

    return (
        <Formik
        initialValues={{
          text: ""
        }}
        onSubmit={async values => {
          addChirp(values.text)
          values.text = ""
        }}
  
        validationSchema={Yup.object().shape({
            text: Yup.string()
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
              <label htmlFor="text" style={{ display: "block" }}>
                Chirp
              </label>
              <input
                id="text"
                placeholder="What's happening?"
                type="text"
                value={values.text}
                onChange={handleChange}
                onBlur={handleBlur}
                className={
                  errors.text && touched.text
                    ? "text-input error"
                    : "text-input"
                }
              />
              {errors.text && touched.text && (
                <div className="input-feedback">{errors.text}</div>
              )}
  
  
              <button type="submit" disabled={isSubmitting}>
                Submit Chirp
              </button>
  
            </form>
          );
        }}
      </Formik>
    );
}


export default ChirpForm;