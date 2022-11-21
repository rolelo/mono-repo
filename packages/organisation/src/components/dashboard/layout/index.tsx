import { gql, makeVar, useQuery } from '@apollo/client';
import styled from '@emotion/styled';
import { Fade, MenuItem, Typography } from '@mui/material';
import Navigation from 'common/components/navigation';
import { User } from 'common/models';
import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';

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
  const navigator = useNavigate();
  const { data } = useQuery<{ user: User }>(GET_USER, {
    onCompleted: ({ user }) => {
      userVar(user);
    }
  });
  return (
    <Fade in timeout={600}>
      <Container>
        <Navigation user={data?.user || null} appbarLinks={[
          <MenuItem key="New Listing" onClick={() => navigator('/new-listing')}>
            <Link to="/new-listing" style={{ color: 'inherit', textDecoration: 'none' }}>New Listing</Link>
          </MenuItem>,
          <MenuItem key="View All Listings" onClick={() => navigator('/listings')}>
            <Link to="/listings" style={{ color: 'inherit', textDecoration: 'none' }}>View Listings</Link>
          </MenuItem>
        ]}
          dropdownLinks={[
            <MenuItem key="organisation" onClick={() => navigator('/organisation')}>
              <Typography textAlign="center">Organisations</Typography>
            </MenuItem>]}
          avatarMenu
        />
        <div className="wrapper">
          <Outlet />
        </div>
      </Container>
    </Fade>
  );
}
export default DashboardLayout;
