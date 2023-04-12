import { gql, makeVar, useQuery } from '@apollo/client';
import styled from '@emotion/styled';
import { Fade, MenuItem, Typography } from '@mui/material';
import RDrawer from 'common/components/drawer';
import Navigation from 'common/components/navigation';
import { User } from 'common/models';
import React, { useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import Create from '../../organisation/create';

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
        companyLogo
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
  const [createOrganisationDrawerOpen, setCreateOrganisationDrawerOpen] = useState(false)
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
            </MenuItem>,
            <MenuItem key="create-organisation" onClick={() => setCreateOrganisationDrawerOpen(true)}>
              <Typography textAlign="center">Create Organisation</Typography>
            </MenuItem>
          ]}
          avatarMenu
        />
        <div className="wrapper">
          <Outlet />
        </div>
        <RDrawer
          style={{
            width: '800px',
            maxWidth: '80%',
          }}
          title="Create Organisation"
          subtitle="Organisation"
          extraInformation={
            <>
              {
                `Creating an organisation allows you to import your organisation details when creating a job advert. 
                This saves you time from needing to re-upload the same information when creating a job advert.`
              }
              <br />
              <br />
              {
                `You can have more than one organisation associated with your account,
            allowing you to quickly create job adverts for multiple different companies and positions.`
              }
            </>
          }
          open={createOrganisationDrawerOpen}
          onClose={() => setCreateOrganisationDrawerOpen(false)}
        >
          <Create />
        </RDrawer>
      </Container>
    </Fade>
  );
}
export default DashboardLayout;
