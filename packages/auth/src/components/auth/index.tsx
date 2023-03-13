import styled from '@emotion/styled';
import React from 'react';
import { Outlet, useNavigate, useSearchParams } from 'react-router-dom';
import AppLogo from 'common/logo/logo.png';
import Amplify from 'common/services/Amplify';
import { Hub } from 'aws-amplify';

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
  width: '400px',
  padding: '3rem',
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
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  React.useEffect(() => {
    Hub.listen('auth', ({ payload }) => {
      const { event, data } = payload;
      if (event === 'autoSignIn' || event === 'signIn') {
        // assign user
        Amplify.userSignedIn.next(true);
        Amplify.userInfo.next({ ...data.attributes });
      } else if (event === 'autoSignIn_failure') {
        Amplify.userSignedIn.next(false);
      }
      // redirect to sign in page
      switch (event) {
        case 'signIn':
          const redirectUrl = searchParams.get('redirectUrl');
          window.location.href = redirectUrl || process.env.REACT_APP_CLIENT_URL!;
          break;
        case 'cognitoHostedUI':
        case 'customOAuthState':
          window.location.href = typeof data === 'string' ? data : process.env.REACT_APP_CLIENT_URL!;
      }
    });
    const subscription = Amplify.userSubject.subscribe((user) => {
      if (user?.userConfirmed === false) navigate('/auth/confirm');
    });
    const userSignedInSubscription = Amplify.userSignedIn.subscribe((b) => {
      if (b === false) navigate('/auth/login');
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
