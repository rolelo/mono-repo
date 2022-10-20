import React from 'react';
import styled from '@emotion/styled';
import {
  Button, Divider, Fade, TextField, Typography,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import GoogleButton from 'react-google-button';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from 'react-query';
import type { SignUp as SUT } from 'common/models/signUp';
import Amplify from 'common/services/Amplify';

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

const validationSchema = yup.object().shape({
  name: yup.string().min(2, 'Name too short').max(30, 'Name too long').required('Required'),
  email: yup.string().email('Invalid email').required('Required'),
  password: yup.string().min(8, 'Password must be 8 characters').required('Password is required'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password'), null], 'Passwords must match'),
});

const SignUp: React.FC = () => {
  const mutation = useMutation((data: SUT) => Amplify.signUp(data));
  const { handleSubmit, register, formState: { errors, isValid } } = useForm({
    mode: 'onBlur',
    resolver: yupResolver(validationSchema),
  });

  return (
    <Fade in timeout={600}>
      <CustomForm onSubmit={handleSubmit((data) => mutation.mutate(data as SUT))}>
        <h1>Sign Up</h1>
        <TextField
          size="small"
          label="Name"
          variant="filled"
          fullWidth
          {...register('name')}
          error={Boolean(errors.name?.message)}
          helperText={errors.name?.message?.toString()}
        />
        <TextField
          size="small"
          label="Email"
          variant="filled"
          fullWidth
          {...register('email')}
          error={Boolean(errors.email?.message)}
          helperText={errors.email?.message?.toString()}
        />
        <TextField
          size="small"
          label="Password"
          variant="filled"
          fullWidth
          {...register('password')}
          type="password"
          error={Boolean(errors.password?.message)}
          helperText={errors.password?.message?.toString()}
        />
        <TextField
          size="small"
          label="Confirm Password"
          variant="filled"
          fullWidth
          {...register('confirmPassword')}
          type="password"
          error={Boolean(errors.confirmPassword?.message)}
          helperText={errors.confirmPassword?.message?.toString()}
        />
        <Button variant="contained" type="submit" fullWidth size="large" disabled={!isValid}>Register</Button>
        <Divider />
        <div className="contentHolder">
          <Typography variant="body1">Already have an account?</Typography>
          <Link to="/auth/login">Log In</Link>
        </div>
        <Typography variant="body1">Or</Typography>
        <GoogleButton />
      </CustomForm>
    </Fade>
  );
};

export default SignUp;
