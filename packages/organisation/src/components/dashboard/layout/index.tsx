import styled from '@emotion/styled';
import { Fade } from '@mui/material';
import React from 'react';
import { Outlet } from 'react-router-dom';
import {
  ApolloClient, ApolloProvider, createHttpLink, InMemoryCache,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import Amplify from 'common/services/Amplify';
import Navigation from 'common/components/navigation';
import environmentVars from 'common/utils/env.variables';

const Container = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  height: '1px',
  boxSizing: 'border-box',
  '& > .wrapper': {
    boxSizing: 'border-box',
  },
});

const httpLink = createHttpLink({
  uri: environmentVars.serverUrl,
});
const authLink = setContext(async (_, { headers }) => {
  const token = await Amplify.verifyUser();
  return {
    headers: {
      ...headers,
      authorization: token || '',
    },
  };
});
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

const DashboardLayout: React.FC = () => (
  <ApolloProvider client={client}>
    <Fade in timeout={600}>
      <Container>
        <Navigation />
        <div className="wrapper">
          <Outlet />
        </div>
      </Container>
    </Fade>
  </ApolloProvider>
);

export default DashboardLayout;
