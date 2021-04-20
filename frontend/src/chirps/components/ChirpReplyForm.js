import React from "react";
import { Formik } from 'formik';
import * as Yup from 'yup';

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
              Reply
              </label>
            <input
              id="text"
              placeholder="Chirp your reply"
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


export default ChirpReplyForm;