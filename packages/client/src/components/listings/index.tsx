import React, { useState } from 'react'

import { Box } from '@mui/material';
import ListingsTable from './ListingsTable'
import ListingDrawer from './ListingsDrawer';
import { IListing } from 'common/models';

const Listings = () => {
  const [listing, setListing] = useState<IListing>();
  return (
    <Box sx={{ padding: '2rem' }}>
      <ListingsTable handleRowClick={(listing: IListing) => setListing(listing)} />
      <ListingDrawer listing={listing} handleClose={() => setListing(undefined)} />
    </Box>
  )
}

export default Listings