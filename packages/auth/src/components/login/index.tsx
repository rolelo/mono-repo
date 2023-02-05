import styled from '@emotion/styled';
import {
  Button, Divider, Fade, TextField, Typography,
} from '@mui/material';
import Amplify from 'common/services/Amplify';
import React, { useEffect } from 'react';
import GoogleButton from 'react-google-button';
import { useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import { Link, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Auth, Hub } from 'aws-amplify';

export const CustomForm = styled('form')({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  rowGap: '2rem',
  '> hr': {
    width: '100%',
  },
  '& .contentHolder': {
    textAlign: 'center',
    '& a': {
      fontSize: '1.6rem',
      textDecoration: 'none',
      marginBottom: '8px',
    },
  },
});

type TLogin = {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const [searchParams] = useSearchParams();
  const mutation = useMutation(({ email, password }: TLogin) => Amplify.login(email, password), {
    onSuccess: () => {
      toast.success('Successfully logged in');
      const redirectUrl = searchParams.get('redirectUrl');
      window.location.href = redirectUrl || process.env.REDIRECT_URL!;
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Login Error');
    },
  });
  const { handleSubmit, register } = useForm({
    mode: 'onBlur',
  });

  useEffect(() => {
    const sub = Hub.listen('auth', ({ payload: { event, data } }) => {

      switch (event) {
        case 'cognitoHostedUI':
        case 'customOAuthState':
          console.log(data, process.env.REACT_APP_CLIENT_URL);
          window.location.href = typeof data === 'string' ? data : process.env.REACT_APP_CLIENT_URL!;
      }
    });

    return sub;
  }, [])

  return (
    <Fade in timeout={600}>
      <CustomForm onSubmit={handleSubmit((data) => mutation.mutate(data as TLogin))}>
        <h1>Log In</h1>
        <TextField label="Username" variant="filled" fullWidth {...register('email')} />
        <TextField label="Password" variant="filled" fullWidth {...register('password')} type="password" />
        <Link to="/auth/reset-password">Forgot Password?</Link>
        <Button
          variant="contained"
          type="submit"
          fullWidth
          size="large"
          disabled={mutation.isLoading}
        >
          Login
        </Button>
        <Divider />
        <div className="contentHolder">
          <Typography variant="body1">Dont have an account?</Typography>
          <Link to="/auth/signup">Sign Up</Link>
        </div>
        <Typography variant="body1">Or</Typography>
        <GoogleButton onClick={
          () => Auth.federatedSignIn({
            provider: 'Google' as any,
            customState: searchParams.get('redirectUrl') || ''
          })
        } />
      </CustomForm>
    </Fade>
  );
};

export default Login;
