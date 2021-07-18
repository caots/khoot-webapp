import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { Meta } from 'src/layout/Meta';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { fetchLogin, selectIsAuth } from 'src/features/authen/authenSlide';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  CircularProgress,
  Checkbox
} from '@material-ui/core';
import { Main } from 'src/templates/Main';
import Link from 'next/link';

const Login = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  // global state
  const isAuth_gs = useSelector(selectIsAuth);
  const isPendingLogin_gs = useSelector((state: any) => state.authenSlice.isFetchingLogin);
  const loginMsg_gs = useSelector((state: any) => state.authenSlice.fetchLoginMsg);

  useEffect(() => {
    isAuth_gs && router.push('/');
  }, [isAuth_gs]);

  const handleFormSubmit = (data: any, formik: any) => {
    dispatch(fetchLogin({ ...data, remember_me: data.remember ? 1 : 0 }));
    formik.setSubmitting(isPendingLogin_gs);
  };

  return (
    <Main meta={<Meta title="login" description="Khoot | login" />}>
      <Box
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}
      >
        <Container maxWidth="md" className="wrap-login">
          <Formik
            initialValues={{
              email: '',
              password: '',
              remember: false
            }}
            validationSchema={Yup.object().shape({
              email: Yup.string()
                .email('Định dạng email chưa đúng')
                .max(255)
                .required('Email không được để trống'),
              password: Yup.string().max(255).required('Mật khẩu không được để trống')
            })}
            onSubmit={handleFormSubmit}
          >
            {({
              errors,
              handleBlur,
              handleChange,
              handleSubmit,
              isSubmitting,
              touched,
              values
            }) => (
              <form onSubmit={handleSubmit} className="form-login">
                <Box sx={{ mb: 3 }}>
                  <Typography color="textPrimary" variant="h4">
                    Đăng nhập
                  </Typography>
                </Box>
                <TextField
                  error={Boolean(touched.email && errors.email)}
                  fullWidth
                  helperText={touched.email && errors.email}
                  label="Email"
                  margin="normal"
                  name="email"
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
                />
                {loginMsg_gs && (
                  <Box sx={{ py: 2 }}>
                    <Typography color="error">{loginMsg_gs}</Typography>
                  </Box>
                )}

                <Box sx={{ alignItems: 'center', display: 'flex', ml: -1 }}>
                  <Checkbox checked={values.remember} name="remember" onChange={handleChange} />
                  <Typography color="textSecondary" variant="body1">
                    {`Giữ đăng nhập`}
                  </Typography>
                </Box>

                <Box sx={{ py: 2 }}>
                  <Button
                    color="primary"
                    disabled={isSubmitting}
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                  >
                    {isPendingLogin_gs ? <CircularProgress size={30} /> : `Đăng nhập`}
                  </Button>
                </Box>
                <Typography color="textSecondary" variant="body1">
                  {`Chưa có tài khoản? `}
                  <Link href="/register">Đăng ký ngay</Link>
                </Typography>
              </form>
            )}
          </Formik>
        </Container>
      </Box>
    </Main>
  );
};

export default Login;
