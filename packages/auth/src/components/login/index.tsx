import styled from '@emotion/styled';
import {
  Button, Divider, Fade, TextField, Typography,
} from '@mui/material';
import Amplify from 'common/services/Amplify';
import React from 'react';
import GoogleButton from 'react-google-button';
import { useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const CustomForm = styled('form')({
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
  const mutation = useMutation(({ email, password }: TLogin) => Amplify.login(email, password), {
    onSuccess: () => {
      toast.success('Successfully logged in');
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Login Error');
    },
  });
  const { handleSubmit, register } = useForm({
    mode: 'onBlur',
  });

  return (
    <Fade in timeout={600}>
      <CustomForm onSubmit={handleSubmit((data) => mutation.mutate(data as TLogin))}>
        <h1>Log In</h1>
        <TextField label="Username" variant="filled" fullWidth {...register('email')} />
        <TextField label="Password" variant="filled" fullWidth {...register('password')} type="password" />
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
        <GoogleButton />
      </CustomForm>
    </Fade>
  );
};

export default Login;
