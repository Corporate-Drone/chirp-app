import React from "react";
import { Formik } from 'formik';
import * as Yup from 'yup';
import './ChirpReplyForm.css'
import SendIcon from '@material-ui/icons/Send';

function ChirpReplyForm(props) {
  const { addReply, id } = props;

  return (
    <Formik
      initialValues={{
        text: ""
      }}
      onSubmit={async values => {
        addReply(id, values.text)
        values.text = ""
      }}

      validationSchema={Yup.object().shape({
        text: Yup.string()
          .min(1, 'At least 2 characters required.')
          .max(140, 'Must be less than 140 characters.')
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
          <form onSubmit={handleSubmit} className="ChirpReplyForm">
            {/* <label htmlFor="text" style={{ display: "block" }}>
              Reply
              </label> */}
            <input
              id="text"
              placeholder="Chirp your reply"
              type="text"
              value={values.text}
              onChange={handleChange}
              onBlur={handleBlur}
              className={
                errors.text && touched.text
                  ? "text-input reply-input error"
                  : "text-input reply-input"
              }
            />

            <button type="submit" disabled={isSubmitting}>
              <SendIcon />
            </button>

            {errors.text && touched.text && (
              <div className="input-feedback">{errors.text}</div>
            )}

          </form>
        );
      }}
    </Formik>
  );
}


export default ChirpReplyForm;