import React from 'react';
import clsx from 'clsx';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { Box, Button, FormHelperText, TextField, Link, Grid } from '@material-ui/core';
import useAuth from '../../hooks/useAuth';
import useScriptRef from '../../hooks/useScriptRef';
import { Link as RouterLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
const JWTLogin = ({ className, ...rest }) => {
  const { validatechangepass } = useAuth();
  const scriptedRef = useScriptRef();
  const { selectedDocument } = useSelector((state) => state.document);
  const [redirectLink, setRedirect] = React.useState(false);
  const { executeRecaptcha } = useGoogleReCaptcha();

  return (
    <>
      {redirectLink && <Redirect to="/login" />}
      {!selectedDocument?.email && <Redirect to="/login" />}
      <Formik
        initialValues={{
          email: selectedDocument.email,
          code: '',
          submit: null,
        }}
        validationSchema={Yup.object().shape({
          email: Yup.string().max(255).required('Nhập mã xác nhận'),
          code: Yup.string().max(255).required('Code bắt buộc'),
        })}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          try {
            const token = await executeRecaptcha('confirmCode');
            let data = await validatechangepass(values.email, values.code, token);
            if (data) {
              setErrors({ submit: 'Hệ thống đã gửi mật khẩu mới vào email của bạn.' });
              setTimeout(function () {
                setRedirect(true);
              }, 2000);
            } else {
              setErrors({ submit: 'Mã xác nhận không đúng.' });
            }
          } catch (err) {
            console.error(err);
            if (scriptedRef.current) {
              setStatus({ success: false });
              setErrors({ submit: err.message });
              setSubmitting(false);
            }
          }
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
              disabled={true}
              onBlur={handleBlur}
              onChange={handleChange}
              type="email"
              value={values.email}
              variant="outlined"
            />
            <TextField
              error={Boolean(touched.code && errors.code)}
              fullWidth
              autoFocus
              helperText={touched.code && errors.code}
              label="Mã xác nhận"
              margin="normal"
              name="code"
              size="large"
              onBlur={handleBlur}
              onChange={handleChange}
              type="text"
              value={values.code}
              variant="outlined"
            />

            {errors.submit && (
              <Box mt={3}>
                <FormHelperText error>{errors.submit}</FormHelperText>
              </Box>
            )}
            <Box mt={2}>
              <Button color="primary" disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained">
                Xác nhận thay đổi mật khẩu
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </>
  );
};

export default JWTLogin;
