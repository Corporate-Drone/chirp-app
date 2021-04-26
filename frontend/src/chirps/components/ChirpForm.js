import React, { useContext } from 'react';
import axios from 'axios';
import { Formik } from 'formik';
import * as Yup from 'yup';
import getDate from "../../javascripts/currentDate";
import { AuthContext } from '../../shared/context/auth-context';
import './ChirpForm.css'
import SendIcon from '@material-ui/icons/Send';

function ChirpForm(props) {
    const { fetchChirps } = props;
    const auth = useContext(AuthContext);

    const addChirp = async (newChirp) => {
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
                        console.log('Chirp posted!')
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
            .required("Chirp cannot be blank.")
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
            <form onSubmit={handleSubmit} className="ChirpForm">
              {/* <label htmlFor="text" style={{ display: "block" }}>
                Chirp
              </label> */}
              <input
                id="text"
                placeholder="What's happening?"
                type="text"
                value={values.text}
                onChange={handleChange}
                onBlur={handleBlur}
                className={
                  errors.text && touched.text
                    ? "text-input chirp-input error"
                    : "text-input chirp-input"
                }
              />

              <button type="submit" disabled={isSubmitting}>
                <SendIcon/>
              </button>
              {errors.text && touched.text && (
                <div className="input-feedback"></div>
              )}
  
            </form>
          );
        }}
      </Formik>
    );
}


export default ChirpForm;