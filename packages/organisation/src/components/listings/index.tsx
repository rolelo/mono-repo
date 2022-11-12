import React, { useState } from 'react'

import { Box } from '@mui/material';
import ListingDrawer from './ListingsDrawer';
import { Listing } from 'common/models';
import ListingsTable from './ListingsTable';

const Listings = () => {
  const [listing, setListing] = useState<Listing>();
  return (
    <Box sx={{ padding: '2rem' }}>
      <ListingsTable handleRowClick={(listing: Listing) => setListing(listing)} />
      <ListingDrawer listing={listing} handleClose={() => setListing(undefined)} />
    </Box>
  )
}

export default Listings