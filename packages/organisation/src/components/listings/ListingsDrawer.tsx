import { Box, Button, AppBar, Tabs, Tab, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import DataView from 'common/components/dataview';
import Drawer from 'common/components/drawer';
import { IListing } from 'common/models';
import React from 'react';
import { toast } from 'react-toastify';
import Applicants from '../applicants';

interface TabPanelProps {
  children?: React.ReactNode;
  dir?: string;
  index: number;
  value: number;
}
type Props = {
  listing?: IListing
  handleClose: () => void;
}
function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}
const ListingDrawer: React.FC<Props> = ({ listing, handleClose }) => {
  const theme = useTheme();

  const listingUrl = `https://localhost:3004/listing/${listing?._id}`;
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index: number) => {
    setValue(index);
  };

  return (
    <Drawer
      title={listing?.title || ''}
      subtitle="Job Listing"
      open={Boolean(listing)}
      onClose={handleClose}
    >
      <AppBar position="static">
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="secondary"
          textColor="inherit"
          variant="fullWidth"
          aria-label="full width tabs example"
        >
          <Tab label="Description" />
          <Tab label="Applicants" />
        </Tabs>
      </AppBar>
      <Box sx={{ padding: "2rem 0", display: "flex", flexDirection: "row", columnGap: "1rem" }}>
        <Button sx={{ padding: "1rem", flex: 1 }} variant="contained" color="secondary" onClick={() => {
          navigator.clipboard.writeText(listingUrl);
          toast.info("Link copied to clipboard");
        }}>
          Copy Listing To Clipboard
        </Button>
        <Button sx={{ padding: 0, flex: 1 }} variant="contained" color="primary">
          <a style={{ color: "white", textDecoration: "none", padding: "1rem", width: "100%" }} href={listingUrl} target="_blank" rel="noreferrer">View Listing</a>
        </Button>
      </Box>
      <TabPanel value={value} index={0} dir={theme.direction}>
        {
          listing && <DataView data={listing} />
        }
      </TabPanel>
      <TabPanel value={value} index={1} dir={theme.direction}>
        {
          listing?._id && (
            <Applicants jobId={listing._id} />
          )
        }
      </TabPanel>
    </Drawer>
  )
}

export default ListingDrawer