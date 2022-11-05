import { Box, Button } from '@mui/material';
import DataView from 'common/components/dataview';
import Drawer from 'common/components/drawer';
import { IListing } from 'common/models';
import React from 'react';
import { toast } from 'react-toastify';

type Props = {
  listing?: IListing
  handleClose: () => void;
}
const ListingDrawer: React.FC<Props> = ({ listing, handleClose }) => {
  const listingUrl = `https://localhost:3004/listing/${listing?._id}`;
  return (
    <Drawer
      title={listing?.title || ''}
      subtitle="Job Listing"
      open={Boolean(listing)}
      onClose={handleClose}
    >
      <Box sx={{ padding: "1rem", display: "flex", flexDirection: "row", columnGap: "1rem" }}>
        <Button sx={{ padding: "1rem" }} variant="contained" color="secondary" onClick={() => {
          navigator.clipboard.writeText(listingUrl);
          toast.info("Link copied to clipboard");
        }}>
          Copy Listing To Clipboard
        </Button>
        <Button sx={{ padding: 0 }} variant="contained" color="primary">
          <a style={{ color: "white", textDecoration: "none", padding: "1rem" }} href={listingUrl} target="_blank" rel="noreferrer">View Listing</a>
        </Button>
      </Box>
      {
        listing && <DataView data={listing} />
      }
    </Drawer>
  )
}

export default ListingDrawer