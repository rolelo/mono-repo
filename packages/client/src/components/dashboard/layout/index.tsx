import { gql, makeVar, useQuery } from '@apollo/client';
import styled from '@emotion/styled';
import { Fade, MenuItem } from '@mui/material';
import RDrawer from 'common/components/drawer';
import Navigation from 'common/components/navigation';
import { User } from 'common/models';
import React, { useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import UserProfile from '../../user-profile';

export const GET_USER = gql`
  query GET_USER {
    user {
      name
      email
      phoneNumber
      profile {
        rightToWorkInUK
        rightToWorkInEU
        rightToWorkInUS
        cv
        salaryLookingFor
        techSkills
        yearsOfExperience
        countryOfResidence
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
  const [open, setOpen] = useState(false);
  const { data } = useQuery<{ user: User }>(GET_USER, {
    onCompleted: ({ user }) => {
      userVar(user);
    }
  });

  return (
    <Fade in timeout={600}>
      <Container>
        <Navigation user={data?.user || null}
          dropdownLinks={[
            <MenuItem key="New Listing" onClick={() => setOpen(true)}>
              User Profile
            </MenuItem>,
          ]} appbarLinks={[
            ...(data?.user ? [<MenuItem key="Jobs Applied" onClick={() => navigator('/jobs/applied')}>
              <Link to="/jobs/applied" style={{ color: 'inherit', textDecoration: 'none' }}>View Your Applied Jobs</Link>
            </MenuItem>,
            ] : [])
          ]} avatarMenu />
        <Outlet />
        <RDrawer
          open={open}
          onClose={() => setOpen(false)}
          title="User & Job Profile"
          subtitle="Stand out from the crowd"
          extraInformation="Use this section to stand out from the crowd, by building an attractive job profile you increase the chances of landing your dream position"
        >
          <UserProfile />
        </RDrawer>
      </Container>
    </Fade>
  );
}
export default DashboardLayout;
