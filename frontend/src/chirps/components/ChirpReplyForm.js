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
            {errors.text && touched.text && (
              <div className="input-feedback"></div>
            )}


            <button type="submit" disabled={isSubmitting}>
              <SendIcon />
            </button>

          </form>
        );
      }}
    </Formik>
  );
}


export default ChirpReplyForm;