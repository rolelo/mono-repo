import { useState } from 'react';

import { Box } from '@mui/material';
import { Listing } from 'common/models';
import ApplicantsTable from './ApplicationsTable';

const Applicants = () => {
  const [, setListing] = useState<Listing>();
  return (
    <Box sx={{ padding: '2rem' }}>
      <ApplicantsTable handleRowClick={(listing: Listing) => setListing(listing)} />
    </Box>
  )
}

export default Applicants