import { gql, makeVar, useQuery } from '@apollo/client';
import styled from '@emotion/styled';
import { Fade } from '@mui/material';
import Navigation from 'common/components/navigation';
import { User } from 'common/models';
import React from 'react';
import { Outlet } from 'react-router-dom';

const GET_USER = gql`
  query GET_USER {
    user {
      name,
      email,
      phoneNumber,
      organisations {
        _id,
        name,
        website,
        email,
        companyDescription
      }
    }
  }
`;

const Container = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  height: '1px',
  boxSizing: 'border-box',
  '& > .wrapper': {
    boxSizing: 'border-box',
  },
});

export const userVar = makeVar<User | null>(null);
const DashboardLayout: React.FC = () => {
  useQuery<{ user: User }>(GET_USER, {
    onCompleted: ({ user }) => {
      userVar(user);
    }
  });
  return (
    <Fade in timeout={600}>
      <Container>
        <Navigation />
        <div className="wrapper">
          <Outlet />
        </div>
      </Container>
    </Fade>
  );
}
export default DashboardLayout;
