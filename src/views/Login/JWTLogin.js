import React from 'react';
import clsx from 'clsx';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { Box, Button, FormHelperText, TextField, Link, Grid } from '@material-ui/core';
import useAuth from '../../hooks/useAuth';
import useScriptRef from '../../hooks/useScriptRef';
import { Link as RouterLink } from 'react-router-dom';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
const JWTLogin = ({ className, ...rest }) => {
  const { login } = useAuth();
  const scriptedRef = useScriptRef();
  const { executeRecaptcha } = useGoogleReCaptcha();

  return (
    <Formik
      initialValues={{
        email: '',
        password: '',
        company: 'HNN',
        submit: null,
      }}
      validationSchema={Yup.object().shape({
        email: Yup.string().email('Email chưa đúng định dạng').max(255).required('Email bắt buộc'),
        password: Yup.string().max(255).required('Mật khẩu bắt buộc'),
        company: Yup.string().max(255).required('Tên công ty bắt buộc'),
      })}
      onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
        try {
          const token = await executeRecaptcha('login');
          await login(values.email, values.password, token);

          if (scriptedRef.current) {
            setStatus({ success: true });
            setSubmitting(false);
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
            onBlur={handleBlur}
            onChange={handleChange}
            type="email"
            value={values.email}
            variant="outlined"
          />
          <TextField
            error={Boolean(touched.password && errors.password)}
            fullWidth
            helperText={touched.password && errors.password}
            label="Mật khẩu"
            margin="normal"
            name="password"
            onBlur={handleBlur}
            onChange={handleChange}
            type="password"
            value={values.password}
            variant="outlined"

            // InputLabelProps={{ style: { fontSize:20 } }}
          />
          {errors.submit && (
            <Box mt={3}>
              <FormHelperText error>{errors.submit}</FormHelperText>
            </Box>
          )}
          <Box mt={2}>
            <Grid container direction="column" spacing={4} justifyContent="center">
              <Grid item xs={12}>
                <Grid container justifyContent="space-between">
                  <Grid item></Grid>
                  <Grid item>
                    <RouterLink to="/forgot">Quên mật khẩu</RouterLink>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Box>
          <Box mt={2}>
            <Button color="primary" disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained">
              Đăng nhập
            </Button>
          </Box>
        </form>
      )}
    </Formik>
  );
};

export default JWTLogin;
