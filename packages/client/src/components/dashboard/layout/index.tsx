import styled from '@emotion/styled';
import { Fade, MenuItem } from '@mui/material';
import Navigation from 'common/components/navigation';
import React, { useState } from 'react';
import { Outlet, useNavigate, Link } from 'react-router-dom';
import UserProfile from '../../user-profile';
import RDrawer from 'common/components/drawer';

const Container = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  height: '1px',
  boxSizing: 'border-box',
  '& > .wrapper': {
    boxSizing: 'border-box',
  },
});

const DashboardLayout: React.FC = () => {
  const [open, setOpen] = useState(false);
  const navigator = useNavigate();
  return (
    <Fade in timeout={600}>
      <Container>
        <Navigation dropdownLinks={[
          <MenuItem key="New Listing" onClick={() => setOpen(true)}>
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
