import { Box, Button } from '@mui/material';

import DataView from 'common/components/dataview';
import Drawer from 'common/components/drawer';
import { Listing } from 'common/models';
import React, { useMemo } from 'react';
import { toast } from 'react-toastify';

type Props = {
  listing?: Listing
  handleClose: () => void;
}
const ListingDrawer: React.FC<Props> = ({ listing, handleClose }) => {
  const data = useMemo(() => {
    if (!listing) return {};
    const { applicants, ...rest } = listing;
    return {
      ...rest,
      applicants: listing?.applicants?.length || 0
    }
  }, [listing]);

  const listingUrl = `https://localhost:3004/listing/${listing?._id}`;

  return (
    <Drawer
      title={listing?.title || ''}
      subtitle="Job Listing"
      open={Boolean(listing)}
      onClose={handleClose}
    >
      {
        listing && <DataView data={data} />
      }
      <Box sx={{ padding: "2rem 0", display: "flex", flexDirection: "row", columnGap: "1rem", justifyContent: "flex-end" }}>
        <Button  variant="contained" color="secondary" size='small' onClick={() => {
          navigator.clipboard.writeText(listingUrl);
          toast.info("Link copied to clipboard");
        }}>
          Copy Listing To Clipboard
        </Button>
        <Button  size='small' variant="contained" color="primary">
          <a style={{ color: "white", textDecoration: "none", padding: "1rem", width: "100%" }} href={listingUrl} target="_blank" rel="noreferrer">View Listing</a>
        </Button>
      </Box>
    </Drawer>
  )
}

export default ListingDrawer