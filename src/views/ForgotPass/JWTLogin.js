import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { Box, Button, FormHelperText, TextField, Link, Grid } from '@material-ui/core';
import useAuth from '../../hooks/useAuth';
import useScriptRef from '../../hooks/useScriptRef';
import { Link as RouterLink } from 'react-router-dom';
import { Redirect } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { DOCUMENT_CHANGE } from '../../store/actions';
const JWTLogin = ({ className, ...rest }) => {
  const { forgotpass } = useAuth();
  const scriptedRef = useScriptRef();
  const [redirectLink, setRedirect] = useState(false);
  const dispatch = useDispatch();
  return (
    <>
      {redirectLink && <Redirect to="/confirm" />}
      <Formik
        initialValues={{
          email: '',
          submit: null,
        }}
        validationSchema={Yup.object().shape({
          email: Yup.string().email('Email chưa đúng định dạng').max(255).required('Email bắt buộc'),
        })}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          try {
            let data = await forgotpass(values.email);
            if (data) {
              dispatch({ type: DOCUMENT_CHANGE, selectedDocument: { email: values.email } });
              setRedirect(true);
            } else {
              values.email = '';
              setErrors({ submit: 'Email không tồn tại' });
            }
          } catch (err) {}
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit} className={clsx(className)} {...rest}>
            <TextField
              error={Boolean(touched.email && errors.email)}
              fullWidth
              autoFocus
              helperText={touched.email && errors.email}
              label="Email"
              margin="normal"
              name="email"
              size="large"
              onBlur={handleBlur}
              onChange={handleChange}
              type="email"
              value={values.email}
              variant="outlined"
            />

            {errors.submit && (
              <Box mt={3}>
                <FormHelperText error>{errors.submit}</FormHelperText>
              </Box>
            )}

            <Box mt={2}>
              <Button color="primary" disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained">
                Gửi email xác nhận
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </>
  );
};

export default JWTLogin;
