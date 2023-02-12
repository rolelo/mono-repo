import {
  AppBar, Box, Tab, Tabs,
} from '@mui/material';
import React from 'react';
import RDrawer from 'common/components/drawer';
import Create from './create';
import View from './view';

const Organisation = () => {
  const [tabValue, setTabValue] = React.useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <>
      <AppBar position="relative" color="inherit" style={{ padding: 0 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="secondary"
          textColor="inherit"
          variant="fullWidth"
          aria-label="full width tabs example"
        >
          <Tab label="View Organisations" />
          <Tab label="Create Organisation" />
        </Tabs>
      </AppBar>
      <Box sx={{ padding: '2rem' }}>
        <View />
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
          open={tabValue === 1}
          onClose={() => setTabValue(0)}
        >
          <Create callback={() => handleTabChange(undefined as any, 0)} />
        </RDrawer>
      </Box>
    </>
  );
};

export default Organisation;
