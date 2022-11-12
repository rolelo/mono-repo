import { gql, makeVar, useQuery } from '@apollo/client';
import styled from '@emotion/styled';
import { Fade, MenuItem } from '@mui/material';
import RDrawer from 'common/components/drawer';
import Navigation from 'common/components/navigation';
import { User } from 'common/models';
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
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
  const [open, setOpen] = useState(false);
  useQuery<{ user: User }>(GET_USER, {
    onCompleted: ({ user }) => {
      console.log(user);
      userVar(user);
    }
  });
  return (
    <Fade in timeout={600}>
      <Container>
        <Navigation dropdownLinks={[
          <MenuItem selected={true} key="New Listing" onClick={() => setOpen(true)}>
            User Profile
          </MenuItem>,
        ]} appbarLinks={[]} avatarMenu />
        <div className="wrapper" style={{ padding: '2rem' }}>
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
        </div>
      </Container>
    </Fade>
  );
}
export default DashboardLayout;
