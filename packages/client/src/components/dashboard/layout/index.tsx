import styled from '@emotion/styled';
import { Fade } from '@mui/material';
import Navigation from 'common/components/navigation';
import React from 'react';
import { Outlet } from 'react-router-dom';

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
  return (
    <Fade in timeout={600}>
      <Container>
        <Navigation dropdownLinks={[]} appbarLinks={[]} avatarMenu={false} />
        <div className="wrapper">
          <Outlet />
        </div>
      </Container>
    </Fade>
  );
}
export default DashboardLayout;
