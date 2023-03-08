
import { Box } from '@mui/material';
import { Listing } from 'common/models';
import ListingsTable from './ListingsTable';

const Listings = () => {
  // const [listing, setListing] = useState<Listing>();
  return (
    <Box sx={{ padding: '2rem' }}>
      <ListingsTable handleRowClick={(listing: Listing) => window.open(`${process.env.REACT_APP_CLIENT_URL}/listing/${listing._id}`) } />
      {/* <ListingDrawer listing={listing} handleClose={() => setListing(undefined)} /> */}
    </Box>
  )
}

export default Listings