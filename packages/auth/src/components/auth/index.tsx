import styled from '@emotion/styled';
import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import AppLogo from 'common/logo/logo.png';
import Amplify from 'common/services/Amplify';

const Container = styled('div')({
  height: '100vh',
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transform: 'translateY(-4rem)',
});
const Wrapper = styled('div')({
  borderRadius: '1rem',
  padding: '3rem',
  backgroundColor: 'white',
  width: '35rem',
  display: 'flex',
  flexDirection: 'column',
  maxWidth: '80%',
  rowGap: '0.5rem',
  alignItems: 'center',
  '> img': {
    width: '4rem',
  },
  '> hr': {
    width: '100%',
  },
});

const Auth: React.FC = () => {
  const navigate = useNavigate();
  React.useEffect(() => {
    const subscription = Amplify.userSubject.subscribe((user) => {
      if (user?.userConfirmed === false) navigate('/auth/confirm');
    });
    const userSignedInSubscription = Amplify.userSignedIn.subscribe((b) => {
      if (b === false) navigate('/auth/login');
      if (b === true) {
        Amplify.userSignedIn.next(null);
        navigate('/dashboard');
      }
    });
    return () => {
      subscription.unsubscribe();
      userSignedInSubscription.unsubscribe();
    };
  }, [navigate]);
  return (
    <Container>
      <Wrapper className="box-shadow">
        <img src={AppLogo} alt="Rolelo" title="Rolelo" />
        <Outlet />
      </Wrapper>
    </Container>
  );
};

export default Auth;
